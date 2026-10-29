import { container, skipUnlessAiProviderEnabled } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { AiConfigurationPage, AuditLogsPage, BackofficeAssistantPage } from '@pages/backoffice';
import { BackofficeAssistantDemoStaticFixtures } from '@interfaces/demo';

const ASSISTANT_FEATURE = 'backoffice_assistant';

describe(
  'Backoffice Assistant - global Back Office chat widget',
  {
    tags: ['@demo', '@backoffice-assistant', '@ai-commerce'],
  },
  (): void => {
    const userLoginScenario = container.get(UserLoginScenario);
    const backofficeAssistantPage = container.get(BackofficeAssistantPage);
    const aiConfigurationPage = container.get(AiConfigurationPage);
    const auditLogsPage = container.get(AuditLogsPage);

    const restoreBackofficeAssistantOpenAiVendor = (): Cypress.Chainable => {
      backofficeAssistantPage.clearWidgetPanelState();

      return aiConfigurationPage.setFeatureVendor(ASSISTANT_FEATURE, 'openai');
    };

    const buildAnswerEvents = (
      answer: string,
      messageMetadata: Record<string, unknown> = {}
    ): Array<Record<string, unknown>> => [
      { type: 'start', messageMetadata },
      { type: 'text-start', id: 'answer' },
      { type: 'text-delta', id: 'answer', delta: answer },
      { type: 'text-end', id: 'answer' },
      { type: 'finish' },
    ];

    const readRequestBody = (body: unknown): Record<string, unknown> =>
      typeof body === 'string' ? JSON.parse(body) : (body as Record<string, unknown>);

    let staticFixtures: BackofficeAssistantDemoStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      backofficeAssistantPage.enableAssistant();
    });

    it(
      'injects the trigger globally (dashboard + Sales), and clicking it opens the panel with the greeting and core controls',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitDashboard().its('response.statusCode').should('eq', 200);

        backofficeAssistantPage
          .getTrigger()
          .should('be.visible')
          .and('contain.text', backofficeAssistantPage.getTriggerLabel());
        backofficeAssistantPage.getPanel().should('exist').and('have.attr', 'role', 'dialog');

        backofficeAssistantPage.visitSales().its('response.statusCode').should('eq', 200);
        backofficeAssistantPage
          .getTrigger()
          .should('be.visible')
          .and('contain.text', backofficeAssistantPage.getTriggerLabel());

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.getTrigger().should('have.attr', 'aria-pressed', 'true');
        backofficeAssistantPage.getWelcomeText().should('contain.text', backofficeAssistantPage.getGreetingText());
        backofficeAssistantPage.getAgentSelectorToggle().should('be.visible');
        backofficeAssistantPage
          .getInput()
          .should('be.visible')
          .and('have.attr', 'placeholder', backofficeAssistantPage.getInputPlaceholder());
        backofficeAssistantPage.getSend().should('be.visible');
        backofficeAssistantPage.getMoreToggle().should('be.visible');
        backofficeAssistantPage.getAttachButton().should('be.visible');

        backofficeAssistantPage.typeMessage('List the latest orders');
        backofficeAssistantPage.getInput().should('have.value', 'List the latest orders');

        backofficeAssistantPage.closePanel();
      }
    );

    it(
      'the agent picker lists Auto plus every config-enabled agent, and selecting one updates the active-agent label',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage
          .getAgentSelectorLabel()
          .should('contain.text', backofficeAssistantPage.getAutoAgentLabel());

        backofficeAssistantPage.getAgentSelectorToggle().click();
        backofficeAssistantPage
          .getAgentOptionLabels()
          .first()
          .should('contain.text', backofficeAssistantPage.getAutoAgentLabel());
        staticFixtures.enabledAgents.forEach((agentName): void => {
          backofficeAssistantPage.getAgentOptionLabels().should('contain.text', agentName);
        });

        backofficeAssistantPage.getAgentOption(backofficeAssistantPage.getOrderManagementAgentLabel()).click();

        backofficeAssistantPage
          .getAgentSelectorLabel()
          .should('contain.text', backofficeAssistantPage.getOrderManagementAgentLabel());
      }
    );

    it(
      'sends the prompt POST with the message payload and CSRF header, and recovers when the provider fails',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithFailure();

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.typeMessage('List the latest orders');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt').then((interception): void => {
          const body = readRequestBody(interception.request.body);
          expect(body.message).to.eq('List the latest orders');
          expect(body).to.have.property('selectedAgent');
          expect(interception.request.headers).to.have.property(
            backofficeAssistantPage.getCsrfTokenHeaderName().toLowerCase()
          );
        });

        backofficeAssistantPage.getUserMessage().should('contain.text', 'List the latest orders');
        backofficeAssistantPage.getErrorMessage().should('contain.text', backofficeAssistantPage.getGenericErrorText());
        backofficeAssistantPage.getRetryButton().should('be.visible');
        backofficeAssistantPage.getInput().should('not.be.disabled');
      }
    );

    it(
      'attaches a file as a chip, carries it in the prompt POST, and recovers when the provider fails',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithFailure();

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.attachFile(staticFixtures.attachmentImagePath);

        backofficeAssistantPage
          .getAttachmentChipName()
          .should('be.visible')
          .and('contain.text', staticFixtures.attachmentImageName);

        backofficeAssistantPage.typeMessage('Describe the attached image');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt').then((interception): void => {
          const attachments = readRequestBody(interception.request.body).attachments as Array<Record<string, unknown>>;
          expect(attachments).to.have.length(1);
          expect(attachments[0].mediaType).to.eq('image/png');
        });

        backofficeAssistantPage.getMessageAttachmentPill().should('have.length', 1);
        backofficeAssistantPage.getErrorMessage().should('contain.text', backofficeAssistantPage.getGenericErrorText());
        backofficeAssistantPage.getAttachmentChip().should('not.exist');
        backofficeAssistantPage.getInput().should('not.be.disabled');
      }
    );

    it(
      'adds the page form as a context chip, carries it in the prompt POST, and recovers when the provider fails',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithFailure();

        backofficeAssistantPage.visitContextPage();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage
          .getFormContextSuggestionName()
          .should('be.visible')
          .and('contain.text', staticFixtures.contextFormName);

        backofficeAssistantPage.addFormContext();

        backofficeAssistantPage
          .getFormContextChipName()
          .should('be.visible')
          .and('contain.text', staticFixtures.contextFormName);

        backofficeAssistantPage.typeMessage('Review the fields on this form');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt').then((interception): void => {
          const body = readRequestBody(interception.request.body);
          expect(body.message).to.eq('Review the fields on this form');
          expect((body.formContext as Record<string, unknown>).name).to.eq(staticFixtures.contextFormName);
        });

        backofficeAssistantPage.getUserMessage().should('contain.text', 'Review the fields on this form');
        backofficeAssistantPage.getErrorMessage().should('contain.text', backofficeAssistantPage.getGenericErrorText());
        backofficeAssistantPage.getFormContextChip().should('not.be.visible');
        backofficeAssistantPage.getInput().should('not.be.disabled');
      }
    );

    it(
      'persists a streamed conversation reference, and New chat resets the conversation without loading any messages',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithStreamEvents(
          buildAnswerEvents('Persisted answer.', { conversationReference: staticFixtures.stubbedConversationReference })
        );
        backofficeAssistantPage.interceptConversationMessages();

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.typeMessage('Persist this conversation');
        backofficeAssistantPage.send();
        cy.wait('@assistantPrompt');

        backofficeAssistantPage.getAssistantMessage().last().should('contain.text', 'Persisted answer.');
        backofficeAssistantPage
          .readStoredConversationReference()
          .should('eq', staticFixtures.stubbedConversationReference);

        backofficeAssistantPage.newChat();

        backofficeAssistantPage.getWelcomeText().should('contain.text', backofficeAssistantPage.getGreetingText());
        backofficeAssistantPage.getUserMessage().should('not.exist');
        backofficeAssistantPage.getAssistantMessage().should('not.exist');
        backofficeAssistantPage.readStoredConversationReference().should('be.null');
        // eslint-disable-next-line spryker-cypress/no-cy-get-outside-repository -- Reads a cy.intercept() alias, not a DOM selector; there is no selector to move into a repository.
        cy.get('@assistantConversationMessages.all').should('have.length', 0);
      }
    );

    it(
      'a streamed reasoning block renders separately from the assistant answer',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithStreamEvents([
          { type: 'start', messageMetadata: {} },
          { type: 'reasoning-start', id: 'reasoning' },
          { type: 'reasoning-delta', id: 'reasoning', delta: 'Inspecting the latest orders to answer the request.' },
          { type: 'reasoning-end', id: 'reasoning' },
          ...buildAnswerEvents('Here is a short summary.').slice(1),
        ]);

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.typeMessage('Explain your reasoning');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt');

        backofficeAssistantPage
          .getReasoning()
          .should('be.visible')
          .and('contain.text', 'Inspecting the latest orders to answer the request.');
        backofficeAssistantPage.getAssistantMessage().last().should('contain.text', 'Here is a short summary.');
        backofficeAssistantPage.getRetryButton().should('not.exist');
      }
    );

    it(
      'a streamed error event renders its own text with a retry control, not the generic transport failure',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithStreamEvents([
          { type: 'start', messageMetadata: {} },
          { type: 'error', errorText: 'The selected agent could not process the request.' },
        ]);

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.typeMessage('Trigger an in-stream error');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt');

        backofficeAssistantPage
          .getErrorMessage()
          .should('contain.text', 'The selected agent could not process the request.')
          .and('not.contain.text', backofficeAssistantPage.getGenericErrorText());
        backofficeAssistantPage.getRetryButton().should('be.visible');
        backofficeAssistantPage.getInput().should('not.be.disabled');
      }
    );

    it(
      'a streamed agent in the start metadata updates the active-agent label without a user selection',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithStreamEvents(
          buildAnswerEvents('Handled by the resolved agent.', { agent: staticFixtures.stubbedAgentName })
        );

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage
          .getAgentSelectorLabel()
          .should('contain.text', backofficeAssistantPage.getAutoAgentLabel())
          .and('not.contain.text', staticFixtures.stubbedAgentName);

        backofficeAssistantPage.typeMessage('Let the assistant pick an agent');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt');

        backofficeAssistantPage.getAgentSelectorLabel().should('contain.text', staticFixtures.stubbedAgentName);
        backofficeAssistantPage.getAssistantMessage().last().should('contain.text', 'Handled by the resolved agent.');
      }
    );

    it(
      'a streamed tool input without output renders no tool-call block, only the final assistant answer',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithStreamEvents([
          { type: 'start', messageMetadata: {} },
          { type: 'tool-input-start', toolCallId: 'call-1', toolName: staticFixtures.stubbedToolName },
          {
            type: 'tool-input-available',
            toolCallId: 'call-1',
            toolName: staticFixtures.stubbedToolName,
            input: { limit: 5 },
          },
          ...buildAnswerEvents('Fetched the orders.').slice(1),
        ]);

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.typeMessage('Trigger a tool call');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt');

        backofficeAssistantPage.getAssistantMessage().last().should('contain.text', 'Fetched the orders.');
        backofficeAssistantPage.getToolCall().should('not.exist');
      }
    );

    it(
      'a streamed tool output renders a tool-call block with the tool name and a result toggle',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithStreamEvents([
          { type: 'start', messageMetadata: {} },
          {
            type: 'tool-input-available',
            toolCallId: 'call-1',
            toolName: staticFixtures.stubbedToolName,
            input: { limit: 5 },
          },
          { type: 'tool-output-available', toolCallId: 'call-1', output: '{"orders":3}' },
          ...buildAnswerEvents('Summarised the result.').slice(1),
        ]);

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.typeMessage('Trigger a tool result');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt');

        backofficeAssistantPage.getToolCall().should('have.length', 1);
        backofficeAssistantPage.getToolCallName().should('contain.text', staticFixtures.stubbedToolLabel);
        backofficeAssistantPage.getToolCallToggle().should('be.visible');
        backofficeAssistantPage.getAssistantMessage().last().should('contain.text', 'Summarised the result.');
      }
    );

    it(
      'a streamed form-fill data event writes the value into the current page form',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithStreamEvents([
          { type: 'start', messageMetadata: {} },
          {
            type: 'data-form-fill',
            data: { fields: { [staticFixtures.formFill.targetFieldName]: staticFixtures.formFillTargetValue } },
          },
          ...buildAnswerEvents('Filled the requested field.').slice(1),
        ]);

        backofficeAssistantPage.visitContextPage();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.getFormFillTargetField(staticFixtures.formFill.targetFieldName).should('exist');

        backofficeAssistantPage.typeMessage('Fill the product name field');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt');

        backofficeAssistantPage
          .getFormFillTargetField(staticFixtures.formFill.targetFieldName)
          .should('have.value', staticFixtures.formFillTargetValue);
        backofficeAssistantPage.getAssistantMessage().last().should('contain.text', 'Filled the requested field.');
      }
    );

    it(
      'sanitizes a streamed answer: markdown renders but script/onerror payloads are stripped',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithStreamEvents(buildAnswerEvents(staticFixtures.xssPromptPayload));

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        cy.window().then((win) => {
          (win as unknown as Record<string, unknown>).__baXss = undefined;
        });

        backofficeAssistantPage.typeMessage('Render untrusted markup');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt');

        backofficeAssistantPage
          .getAssistantMessage()
          .last()
          /* eslint-disable spryker-cypress/no-cy-get-outside-repository -- XSS sanitization probe: generic HTML tag/attribute names scoped by .within(), not page selectors to move into a repository. */
          .within((): void => {
            cy.get('strong').should('contain.text', 'bold');
            cy.get('script').should('not.exist');
            cy.get('[onerror]').should('not.exist');
          });
        /* eslint-enable spryker-cypress/no-cy-get-outside-repository */

        cy.window().its('__baXss').should('be.undefined');
      }
    );

    it(
      'the retry control after a transport failure actually re-fires the prompt POST',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithFailure();

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.typeMessage('Retry me');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt');
        backofficeAssistantPage.getRetryButton().should('be.visible').click();

        cy.wait('@assistantPrompt').then((interception): void => {
          expect(readRequestBody(interception.request.body).message).to.eq('Retry me');
        });
        // eslint-disable-next-line spryker-cypress/no-cy-get-outside-repository -- Reads a cy.intercept() alias, not a DOM selector; there is no selector to move into a repository.
        cy.get('@assistantPrompt.all').should('have.length.at.least', 2);
      }
    );

    it(
      'removing an attachment chip before sending drops it — the sent prompt POST carries no attachment',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithFailure();

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.attachFile(staticFixtures.attachmentImagePath);
        backofficeAssistantPage.getAttachmentChip().should('have.length', 1);

        backofficeAssistantPage.removeFirstAttachmentChip();
        backofficeAssistantPage.getAttachmentChip().should('not.exist');

        backofficeAssistantPage.typeMessage('No attachment should be sent');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt').then((interception): void => {
          const attachments = readRequestBody(interception.request.body).attachments;
          expect(attachments ?? []).to.have.length(0);
        });
        backofficeAssistantPage.getMessageAttachmentPill().should('not.exist');
      }
    );

    it(
      'attaching two files shows two chips and the sent prompt POST carries both attachments',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithFailure();

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.attachFile([staticFixtures.attachmentImagePath, staticFixtures.attachmentImagePath]);
        backofficeAssistantPage.getAttachmentChip().should('have.length', 2);

        backofficeAssistantPage.typeMessage('Describe both attachments');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt').then((interception): void => {
          expect(readRequestBody(interception.request.body).attachments).to.have.length(2);
        });
        backofficeAssistantPage.getMessageAttachmentPill().should('have.length', 2);
      }
    );

    it(
      'selecting an unsupported file type is rejected client-side with an inline notice and no attachment chip',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.attachFile(staticFixtures.unsupportedAttachmentPath);

        backofficeAssistantPage.getAttachmentChip().should('not.exist');
        backofficeAssistantPage
          .getAttachmentNotice()
          .should('be.visible')
          .and('contain.text', backofficeAssistantPage.getUnsupportedFileTypeText());
      }
    );

    it('lists conversations in the histories view and removes a row on delete', { tags: ['@demo-smoke'] }, (): void => {
      backofficeAssistantPage.interceptConversationsWith(
        [
          {
            conversationReference: 'cypress-stub-conv-a',
            name: staticFixtures.historyEntryName,
            agent: backofficeAssistantPage.getOrderManagementAgentLabel(),
            updatedAt: 0,
          },
          {
            conversationReference: 'cypress-stub-conv-b',
            name: 'Second stubbed conversation',
            agent: null,
            updatedAt: 0,
          },
        ],
        staticFixtures.enabledAgents
      );
      backofficeAssistantPage.interceptDeleteConversationSuccess();

      backofficeAssistantPage.visitDashboard();
      backofficeAssistantPage.openPanel();
      backofficeAssistantPage.openHistories();

      cy.wait('@assistantConversations');
      backofficeAssistantPage.getHistoryItem().should('have.length', 2);
      backofficeAssistantPage.getHistoryItem().first().should('contain.text', staticFixtures.historyEntryName);

      backofficeAssistantPage.deleteFirstHistoryItem();

      cy.wait('@assistantDeleteConversation').then((interception): void => {
        expect(readRequestBody(interception.request.body).conversationReferences).to.deep.eq(['cypress-stub-conv-a']);
      });
      backofficeAssistantPage.getHistoryItem().should('have.length', 1);
    });

    it(
      'the histories view shows the empty-state notice when no conversations exist',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptConversationsWith([], staticFixtures.enabledAgents);

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();
        backofficeAssistantPage.openHistories();

        cy.wait('@assistantConversations');
        backofficeAssistantPage.getHistoryItem().should('not.exist');
        backofficeAssistantPage
          .getHistoriesEmpty()
          .should('be.visible')
          .and('contain.text', backofficeAssistantPage.getHistoriesEmptyText());
      }
    );

    it(
      'the assistant endpoints reject unauthorized/invalid requests with the documented status contract',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitDashboard();

        const messagesUrl = backofficeAssistantPage.getConversationMessagesUrl();
        const deleteUrl = backofficeAssistantPage.getDeleteConversationUrl();
        const promptUrl = backofficeAssistantPage.getPromptUrl();
        const unknownReference = staticFixtures.unknownConversationReference;
        const invalidTokenHeaders = {
          [backofficeAssistantPage.getCsrfTokenHeaderName()]: backofficeAssistantPage.getInvalidCsrfToken(),
        };

        const contract: Array<{
          description: string;
          request: Partial<Cypress.RequestOptions>;
          expectedStatus: number;
        }> = [
          {
            description: 'conversation messages without a reference is a 400',
            request: { method: 'GET', url: messagesUrl },
            expectedStatus: 400,
          },
          {
            description: 'conversation messages with an unknown reference is a 404',
            request: {
              method: 'GET',
              url: `${messagesUrl}?conversationReference=${encodeURIComponent(unknownReference)}`,
            },
            expectedStatus: 404,
          },
          {
            description: 'prompt over GET is a 405',
            request: { method: 'GET', url: promptUrl },
            expectedStatus: 405,
          },
          {
            description: 'conversation delete with an invalid CSRF token is a 403',
            request: {
              method: 'DELETE',
              url: deleteUrl,
              headers: invalidTokenHeaders,
              body: { conversationReferences: [unknownReference] },
            },
            expectedStatus: 403,
          },
          {
            description: 'prompt with an invalid CSRF token is a 403',
            request: {
              method: 'POST',
              url: promptUrl,
              headers: invalidTokenHeaders,
              body: { message: 'Should never reach the provider' },
            },
            expectedStatus: 403,
          },
        ];

        contract.forEach(({ description, request, expectedStatus }): void => {
          cy.request({ failOnStatusCode: false, ...request }).then((response): void => {
            expect(response.status, description).to.eq(expectedStatus);
          });
        });

        backofficeAssistantPage.readCsrfToken().then((csrfToken): void => {
          expect(csrfToken, 'CSRF token exposed to the chat').to.have.length.greaterThan(0);

          cy.request({
            method: 'DELETE',
            url: deleteUrl,
            failOnStatusCode: false,
            headers: { [backofficeAssistantPage.getCsrfTokenHeaderName()]: csrfToken },
            body: { conversationReferences: [unknownReference] },
          }).then((response): void => {
            expect(response.status, 'valid-token delete of an unknown reference is a 404').to.eq(404);
          });
        });
      }
    );

    it(
      'the prompt endpoint rejects each invalid payload with a resolved message (no 500, no raw glossary key)',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitDashboard();

        const promptUrl = backofficeAssistantPage.getPromptUrl();

        backofficeAssistantPage.readCsrfToken().then((csrfToken): void => {
          expect(csrfToken, 'CSRF token exposed to the chat').to.have.length.greaterThan(0);

          const headers = { [backofficeAssistantPage.getCsrfTokenHeaderName()]: csrfToken };
          const tooManyAttachments = Array.from({ length: staticFixtures.attachmentMaxCount + 1 }, () => ({
            name: 'attachment.png',
            mediaType: 'image/png',
            content: 'QUJD',
          }));

          const invalidPayloads: Array<{ description: string; body: Record<string, unknown>; message: string }> = [
            {
              description: 'empty message',
              body: { message: '' },
              message: staticFixtures.invalidPayloadMessage,
            },
            {
              description: 'unsupported attachment media type',
              body: {
                message: 'Describe this file',
                attachments: [{ name: 'archive.zip', mediaType: 'application/zip', content: 'QUJD' }],
              },
              message: staticFixtures.attachmentUnsupportedMediaTypeMessage,
            },
            {
              description: 'attachment count exceeded',
              body: { message: 'Describe these files', attachments: tooManyAttachments },
              message: staticFixtures.attachmentCountExceededMessage,
            },
          ];

          invalidPayloads.forEach(({ description, body, message }): void => {
            cy.request({ method: 'POST', url: promptUrl, failOnStatusCode: false, headers, body }).then(
              (response): void => {
                expect(response.status, `${description}: rejected, not a 500`).to.be.lessThan(500);

                const rawBody = typeof response.body === 'string' ? response.body : JSON.stringify(response.body);
                expect(rawBody, `${description}: message is resolved`).to.include(message);
                expect(rawBody, `${description}: no unresolved glossary key leaks`).to.not.include(
                  backofficeAssistantPage.getValidationGlossaryKey()
                );
              }
            );
          });
        });
      }
    );

    it(
      'when disabled, every assistant endpoint returns 403 and the chat is not injected',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.disableAssistant();

        [backofficeAssistantPage.getConversationsUrl(), backofficeAssistantPage.getConversationMessagesUrl()].forEach(
          (url): void => {
            cy.request({
              method: 'GET',
              url,
              failOnStatusCode: false,
              headers: { 'X-Requested-With': 'XMLHttpRequest' },
            }).then((response): void => {
              expect(response.status, 'disabled assistant endpoint is a 403').to.eq(403);
            });
          }
        );

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.getTrigger().should('not.exist');
        backofficeAssistantPage.getChat().should('not.exist');

        backofficeAssistantPage.enableAssistant();
      }
    );

    describe('real AI provider flow (full, requires provider token)', { tags: ['@demo-full'] }, (): void => {
      const REAL_FLOW_TIMEOUT = 15000;
      const AWS_REAL_FLOW_TIMEOUT = 45000;

      it(
        'a real prompt streams an assistant answer that renders as a non-empty assistant message',
        { tags: ['@demo-full'] },
        function (): void {
          skipUnlessAiProviderEnabled(this);

          backofficeAssistantPage.interceptRealPrompt();
          backofficeAssistantPage.visitDashboard();
          backofficeAssistantPage.openPanel();

          backofficeAssistantPage.typeMessage(staticFixtures.simplePrompt);
          backofficeAssistantPage.send();

          cy.wait('@assistantRealPrompt', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);

          backofficeAssistantPage
            .getAssistantMessage({ timeout: REAL_FLOW_TIMEOUT })
            .should('have.length.at.least', 1)
            .last()
            .should('not.be.empty');
          backofficeAssistantPage.getUserMessage().should('contain.text', staticFixtures.simplePrompt);
          backofficeAssistantPage.getInput().should('not.be.disabled');
          backofficeAssistantPage.getRetryButton().should('not.exist');
        }
      );

      it(
        'a persisted conversation reloads its prior user and assistant messages from the conversation messages endpoint',
        { tags: ['@demo-full'] },
        function (): void {
          skipUnlessAiProviderEnabled(this);

          backofficeAssistantPage.interceptRealPrompt();
          backofficeAssistantPage.interceptConversations();
          backofficeAssistantPage.interceptConversationMessages();
          backofficeAssistantPage.visitDashboard();
          backofficeAssistantPage.openPanel();

          backofficeAssistantPage.typeMessage(staticFixtures.simplePrompt);
          backofficeAssistantPage.send();
          cy.wait('@assistantRealPrompt', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);
          backofficeAssistantPage.getAssistantMessage({ timeout: REAL_FLOW_TIMEOUT }).should('have.length.at.least', 1);

          backofficeAssistantPage.newChat();
          backofficeAssistantPage.openHistories();

          cy.wait('@assistantConversations', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);
          backofficeAssistantPage.getHistoryItem().should('have.length.at.least', 1);

          backofficeAssistantPage.clickFirstHistoryItem();

          cy.wait('@assistantConversationMessages', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);
          backofficeAssistantPage.getUserMessage().should('have.length.at.least', 1);
          backofficeAssistantPage.getAssistantMessage().should('have.length.at.least', 1);
        }
      );

      it(
        'deleting a conversation this spec created removes its entry from the history list',
        { tags: ['@demo-full'] },
        function (): void {
          skipUnlessAiProviderEnabled(this);

          backofficeAssistantPage.interceptRealPrompt();
          backofficeAssistantPage.interceptConversations();
          backofficeAssistantPage.interceptDeleteConversation();
          backofficeAssistantPage.visitDashboard();
          backofficeAssistantPage.openPanel();

          backofficeAssistantPage.typeMessage(staticFixtures.simplePrompt);
          backofficeAssistantPage.send();
          cy.wait('@assistantRealPrompt', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);
          backofficeAssistantPage.getAssistantMessage({ timeout: REAL_FLOW_TIMEOUT }).should('have.length.at.least', 1);

          backofficeAssistantPage.newChat();
          backofficeAssistantPage.openHistories();
          cy.wait('@assistantConversations', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);

          backofficeAssistantPage
            .getHistoryItem()
            .should('have.length.at.least', 1)
            .then(($items): void => {
              const initialCount = $items.length;

              backofficeAssistantPage.deleteFirstHistoryItem();

              cy.wait('@assistantDeleteConversation', { timeout: REAL_FLOW_TIMEOUT }).then((interception): void => {
                expect(interception.response?.statusCode).to.be.within(200, 299);
                expect(interception.response?.body).to.have.property('deletedCount', 1);
              });

              backofficeAssistantPage.getHistoryItem().should('have.length', initialCount - 1);
            });
        }
      );

      it(
        'the Form Fill agent writes a value into the current page form via a real prompt',
        { tags: ['@demo-full'] },
        function (): void {
          skipUnlessAiProviderEnabled(this);

          backofficeAssistantPage.interceptRealPrompt();
          backofficeAssistantPage.visitContextPage();
          backofficeAssistantPage.openPanel();

          backofficeAssistantPage.addFormContext();
          backofficeAssistantPage.selectAgent(staticFixtures.formFill.agentName);

          backofficeAssistantPage.expandFormFillTargetFieldLocale(staticFixtures.formFill.targetFieldName);

          backofficeAssistantPage
            .getFormFillTargetField(staticFixtures.formFill.targetFieldName)
            .should('be.visible')
            .clear()
            .then(($field): void => {
              const originalValue = String($field.val() ?? '');

              backofficeAssistantPage.typeMessage(staticFixtures.formFill.prompt);
              backofficeAssistantPage.send();

              cy.wait('@assistantRealPrompt', { timeout: REAL_FLOW_TIMEOUT })
                .its('response.statusCode')
                .should('be.within', 200, 299);

              backofficeAssistantPage
                .getFormFillTargetField(staticFixtures.formFill.targetFieldName)
                .should(($updated): void => {
                  const filledValue = String($updated.val() ?? '');
                  expect(filledValue).to.not.equal(originalValue);
                  expect(filledValue.trim()).to.not.be.empty;
                });
            });
        }
      );

      it(
        'the Order Management agent renders a tool-call block alongside a final assistant answer',
        { tags: ['@demo-full'] },
        function (): void {
          skipUnlessAiProviderEnabled(this);

          backofficeAssistantPage.interceptRealPrompt();
          backofficeAssistantPage.visitDashboard();
          backofficeAssistantPage.openPanel();

          backofficeAssistantPage.selectAgent(staticFixtures.orderManagement.agentName);
          backofficeAssistantPage.typeMessage(staticFixtures.orderManagement.prompt);
          backofficeAssistantPage.send();

          cy.wait('@assistantRealPrompt', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);

          backofficeAssistantPage.getToolCall({ timeout: REAL_FLOW_TIMEOUT }).should('have.length.at.least', 1);
          backofficeAssistantPage.getToolCallName().first().should('not.be.empty');
          backofficeAssistantPage.getAssistantMessage({ timeout: REAL_FLOW_TIMEOUT }).should('have.length.at.least', 1);
        }
      );

      it(
        'an attached image sends with a real prompt, shows the attachment pill and renders a non-empty answer',
        { tags: ['@demo-full'] },
        function (): void {
          skipUnlessAiProviderEnabled(this);

          backofficeAssistantPage.interceptRealPrompt();
          backofficeAssistantPage.visitDashboard();
          backofficeAssistantPage.openPanel();

          backofficeAssistantPage.attachFile(staticFixtures.attachmentImagePath);
          backofficeAssistantPage.getAttachmentChipName().should('be.visible');

          backofficeAssistantPage.typeMessage('Describe the attached image.');
          backofficeAssistantPage.send();

          cy.wait('@assistantRealPrompt', { timeout: REAL_FLOW_TIMEOUT }).then((interception): void => {
            expect(interception.response?.statusCode).to.be.within(200, 299);
            expect(readRequestBody(interception.request.body).attachments).to.have.length(1);
          });

          backofficeAssistantPage.getMessageAttachmentPill().should('exist');
          backofficeAssistantPage
            .getAssistantMessage({ timeout: REAL_FLOW_TIMEOUT })
            .should('have.length.at.least', 1)
            .last()
            .should('not.be.empty');
        }
      );

      it(
        'with Auto selected a real answer resolves an agent and populates the active-agent label',
        { tags: ['@demo-full'] },
        function (): void {
          skipUnlessAiProviderEnabled(this);

          backofficeAssistantPage.interceptRealPrompt();
          backofficeAssistantPage.visitDashboard();
          backofficeAssistantPage.openPanel();

          backofficeAssistantPage
            .getAgentSelectorLabel()
            .should('contain.text', backofficeAssistantPage.getAutoAgentLabel());
          backofficeAssistantPage.typeMessage(staticFixtures.simplePrompt);
          backofficeAssistantPage.send();

          cy.wait('@assistantRealPrompt', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);

          backofficeAssistantPage.getAssistantMessage({ timeout: REAL_FLOW_TIMEOUT }).should('have.length.at.least', 1);
          backofficeAssistantPage
            .getAgentSelectorLabel()
            .invoke('text')
            .should('have.length.greaterThan', 0)
            .and('not.eq', backofficeAssistantPage.getAutoAgentLabel());
        }
      );

      let switchedToAws = false;

      after((): void => {
        if (!switchedToAws) {
          return;
        }

        restoreBackofficeAssistantOpenAiVendor();
      });

      it(
        'drives a real prompt against the AWS Bedrock provider and logs a configuration-filterable audit row',
        { tags: ['@demo-full'] },
        function (): void {
          skipUnlessAiProviderEnabled(this);

          switchedToAws = true;
          backofficeAssistantPage.clearWidgetPanelState();
          aiConfigurationPage.setFeatureVendor(ASSISTANT_FEATURE, 'aws');

          backofficeAssistantPage.interceptRealPrompt();
          backofficeAssistantPage.visitDashboard();
          backofficeAssistantPage.openPanel();

          backofficeAssistantPage.selectAgent(staticFixtures.orderManagement.agentName);
          backofficeAssistantPage.typeMessage(staticFixtures.orderManagement.prompt);
          backofficeAssistantPage.send();

          cy.wait('@assistantRealPrompt', { timeout: AWS_REAL_FLOW_TIMEOUT }).then((interception): void => {
            if ((interception.response?.statusCode ?? 0) >= 200 && (interception.response?.statusCode ?? 0) <= 299) {
              return;
            }

            backofficeAssistantPage.getRetryButton().should('be.visible').click();
            cy.wait('@assistantRealPrompt', { timeout: AWS_REAL_FLOW_TIMEOUT })
              .its('response.statusCode')
              .should('be.within', 200, 299);
          });

          backofficeAssistantPage
            .getAssistantMessage({ timeout: AWS_REAL_FLOW_TIMEOUT })
            .should('have.length.at.least', 1)
            .last()
            .should('not.be.empty');

          restoreBackofficeAssistantOpenAiVendor();

          auditLogsPage.assertNewestRowConfigurationIsFilterable('AWS');
        }
      );
    });
  }
);
