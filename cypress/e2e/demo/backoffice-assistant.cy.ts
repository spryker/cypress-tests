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
      'injects the launcher globally (dashboard + Sales), and clicking it opens the panel with the greeting and core controls',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitDashboard().its('response.statusCode').should('eq', 200);

        backofficeAssistantPage
          .getWidgetToggle()
          .should('be.visible')
          .and('contain.text', backofficeAssistantPage.getWidgetToggleLabel());
        backofficeAssistantPage.getWidgetPanel().should('exist').and('have.attr', 'role', 'dialog');

        backofficeAssistantPage.visitSales().its('response.statusCode').should('eq', 200);
        backofficeAssistantPage
          .getWidgetToggle()
          .should('be.visible')
          .and('contain.text', backofficeAssistantPage.getWidgetToggleLabel());

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.getWidgetToggle().should('not.be.visible');
        backofficeAssistantPage.getWidgetMessages().should('contain.text', backofficeAssistantPage.getGreetingText());
        backofficeAssistantPage.getWidgetAgentSelect().should('be.visible');
        backofficeAssistantPage
          .getWidgetInput()
          .should('be.visible')
          .and('have.attr', 'placeholder', backofficeAssistantPage.getInputPlaceholder());
        backofficeAssistantPage.getWidgetSend().should('be.visible');
        backofficeAssistantPage.getWidgetHistoryButton().should('be.visible');
        backofficeAssistantPage.getWidgetNewChat().should('be.visible');
        backofficeAssistantPage.getWidgetAttach().should('be.visible');
      }
    );

    it(
      'the agent picker lists Auto plus every config-enabled agent, and selecting one updates the active-agent badge',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage
          .getWidgetAgentSelect()
          .find('option')
          .first()
          .should('contain.text', backofficeAssistantPage.getAutoAgentLabel());
        staticFixtures.enabledAgents.forEach((agentName): void => {
          backofficeAssistantPage.getWidgetAgentSelect().find('option').should('contain.text', agentName);
        });

        backofficeAssistantPage.selectAgent(backofficeAssistantPage.getOrderManagementAgentLabel());

        backofficeAssistantPage
          .getWidgetAgentSelect()
          .should('have.value', backofficeAssistantPage.getOrderManagementAgentLabel());
        backofficeAssistantPage
          .getWidgetAgentBadge()
          .should('contain.text', backofficeAssistantPage.getOrderManagementAgentLabel());
      }
    );

    it('the message input accepts typed text', { tags: ['@demo-smoke'] }, (): void => {
      backofficeAssistantPage.visitDashboard();
      backofficeAssistantPage.openPanel();

      backofficeAssistantPage.typeMessage('List the latest orders');

      backofficeAssistantPage.getWidgetInput().should('have.value', 'List the latest orders');
    });

    it(
      'sends the prompt POST with the message payload and recovers when the provider fails',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithFailure();

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.typeMessage('List the latest orders');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt').then((interception): void => {
          const body = interception.request.body;
          const serialized = typeof body === 'string' ? body : JSON.stringify(body);
          expect(serialized).to.include('prompt');
          expect(serialized).to.include('List the latest orders');
          expect(serialized).to.include('selected_agent');
          expect(serialized).to.include('_token');
        });

        backofficeAssistantPage.getWidgetMessages().should('contain.text', 'List the latest orders');
        backofficeAssistantPage
          .getWidgetMessages()
          .should('contain.text', backofficeAssistantPage.getTransportFailureText());
        backofficeAssistantPage.getWidgetRetryButton().should('be.visible');
        backofficeAssistantPage.getWidgetInput().should('not.be.disabled');
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
          .getWidgetAttachmentChipName()
          .should('be.visible')
          .and('have.attr', 'title', 'backoffice-assistant-attachment.png');

        backofficeAssistantPage.typeMessage('Describe the attached image');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt').then((interception): void => {
          const body = interception.request.body;
          const serialized = typeof body === 'string' ? body : JSON.stringify(body);
          expect(serialized).to.include('attachments');
          expect(serialized).to.include('mediaType');
          expect(serialized).to.include('image/png');
        });

        backofficeAssistantPage.getWidgetMessageAttachmentPill().should('exist');
        backofficeAssistantPage
          .getWidgetMessages()
          .should('contain.text', backofficeAssistantPage.getTransportFailureText());
        backofficeAssistantPage.getWidgetAttachmentsPreview().children().should('have.length', 0);
        backofficeAssistantPage.getWidgetInput().should('not.be.disabled');
      }
    );

    it(
      'adds the page form as a context chip, prefixes the prompt POST with it, and recovers when the provider fails',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithFailure();

        backofficeAssistantPage.visitContextPage();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage
          .getWidgetFormContextSuggestionLabel()
          .should('be.visible')
          .and('contain.text', staticFixtures.contextFormName);

        backofficeAssistantPage.addFormContext();

        backofficeAssistantPage
          .getWidgetContextChipName()
          .should('be.visible')
          .and('contain.text', staticFixtures.contextFormName);

        backofficeAssistantPage.typeMessage('Review the fields on this form');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt').then((interception): void => {
          const body = interception.request.body;
          const serialized = typeof body === 'string' ? body : JSON.stringify(body);
          expect(serialized).to.include('[Form:');
          expect(serialized).to.include(staticFixtures.contextFormName);
          expect(serialized).to.include('Review the fields on this form');
        });

        backofficeAssistantPage.getWidgetMessages().should('contain.text', 'Review the fields on this form');
        backofficeAssistantPage
          .getWidgetMessages()
          .should('contain.text', backofficeAssistantPage.getTransportFailureText());
        backofficeAssistantPage.getWidgetContextChip().should('not.exist');
        backofficeAssistantPage.getWidgetInput().should('not.be.disabled');
      }
    );

    it(
      'New chat resets the conversation locally — it clears the messages, re-renders the greeting and issues no prompt/detail fetch',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithFailure();
        backofficeAssistantPage.interceptDetail();

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.typeMessage('A message that should be wiped by New chat');
        backofficeAssistantPage.getWidgetInput().should('have.value', 'A message that should be wiped by New chat');

        backofficeAssistantPage.newChat();

        backofficeAssistantPage.getWidgetInput().should('have.value', '');
        backofficeAssistantPage.getWidgetMessages().should('contain.text', backofficeAssistantPage.getGreetingText());
        backofficeAssistantPage.getWidgetUserMessage().should('not.exist');

        cy.get('@assistantPrompt.all').should('have.length', 0);
        cy.get('@assistantDetail.all').should('have.length', 0);
      }
    );

    it(
      'a streamed reasoning event renders as a dedicated reasoning bubble, distinct from the AI answer bubble',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithSseEvents([
          { type: 'reasoning', message: 'Inspecting the latest orders to answer the request.' },
          { type: 'ai_response', message: 'Here is a short summary.', conversation_reference: '' },
        ]);

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.typeMessage('Explain your reasoning');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt');

        backofficeAssistantPage
          .getWidgetReasoningMessage()
          .should('be.visible')
          .and('contain.text', 'Inspecting the latest orders to answer the request.');
        backofficeAssistantPage.getWidgetAiMessage().last().should('contain.text', 'Here is a short summary.');
        backofficeAssistantPage.getWidgetRetryButton().should('not.exist');
      }
    );

    it(
      'a streamed error event renders as an AI error bubble with a retry control, distinct from an HTTP transport failure',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithSseEvents([
          { type: 'error', message: 'The selected agent could not process the request.' },
        ]);

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.typeMessage('Trigger an in-stream error');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt');

        backofficeAssistantPage
          .getWidgetMessages()
          .should('contain.text', 'Error: The selected agent could not process the request.');
        backofficeAssistantPage.getWidgetMessages().should('not.contain.text', 'Request failed with status');
        backofficeAssistantPage.getWidgetRetryButton().should('be.visible');
        backofficeAssistantPage.getWidgetInput().should('not.be.disabled');
      }
    );

    it(
      'a streamed agent_selected event updates the active-agent badge without a user selection',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithSseEvents([
          { type: 'agent_selected', agent: staticFixtures.stubbedAgentName, conversation_reference: '' },
          { type: 'ai_response', message: 'Handled by the resolved agent.', conversation_reference: '' },
        ]);

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.getWidgetAgentSelect().should('have.value', '');
        backofficeAssistantPage.getWidgetAgentBadge().should('not.contain.text', staticFixtures.stubbedAgentName);

        backofficeAssistantPage.typeMessage('Let the assistant pick an agent');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt');

        backofficeAssistantPage.getWidgetAgentBadge().should('contain.text', staticFixtures.stubbedAgentName);
        backofficeAssistantPage.getWidgetAiMessage().last().should('contain.text', 'Handled by the resolved agent.');
      }
    );

    it(
      'renders a streamed tool_call event as a tool-call block with the tool name and arguments, no result section',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithSseEvents([
          { type: 'tool_call', name: 'list_orders', arguments: { limit: 5 } },
          { type: 'ai_response', message: 'Fetched the orders.', conversation_reference: '' },
        ]);

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.typeMessage('Trigger a tool call');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt');

        backofficeAssistantPage.getWidgetToolCallMessage().should('have.length', 1);
        backofficeAssistantPage
          .getWidgetToolCallMessage()
          .find(backofficeAssistantPage.getWidgetToolCallNameSelector())
          .should('contain.text', 'list_orders');
        backofficeAssistantPage.getWidgetToolCallArgs().should('contain.text', 'limit');
        backofficeAssistantPage.getWidgetToolCallResultToggle().should('not.exist');
      }
    );

    it(
      'a streamed tool_call_result event renders a tool-call block with a result toggle, distinct from a plain tool_call',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithSseEvents([
          { type: 'tool_call_result', name: 'list_orders', result: '{"orders":3}' },
          { type: 'ai_response', message: 'Summarised the result.', conversation_reference: '' },
        ]);

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.typeMessage('Trigger a tool result');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt');

        backofficeAssistantPage.getWidgetToolCallMessage().should('have.length', 1);
        backofficeAssistantPage
          .getWidgetToolCallMessage()
          .find(backofficeAssistantPage.getWidgetToolCallNameSelector())
          .should('contain.text', 'list_orders');
        backofficeAssistantPage.getWidgetToolCallResultToggle().should('exist').and('be.visible');
      }
    );

    it(
      'a streamed form_fill event writes the value into the current page form, no chat bubble',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithSseEvents([
          {
            type: 'form_fill',
            fields: { [staticFixtures.formFill.targetFieldName]: staticFixtures.formFillTargetValue },
          },
          { type: 'ai_response', message: 'Filled the requested field.', conversation_reference: '' },
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
        backofficeAssistantPage.getWidgetAiMessage().last().should('contain.text', 'Filled the requested field.');
      }
    );

    it(
      'persists a streamed ai_response conversation_reference so New chat then reopen starts fresh',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithSseEvents([
          { type: 'ai_response', message: 'Persisted answer.', conversation_reference: 'cypress-stub-conv-ref-1' },
        ]);
        backofficeAssistantPage.interceptDetail();

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.typeMessage('Persist this conversation');
        backofficeAssistantPage.send();
        cy.wait('@assistantPrompt');

        backofficeAssistantPage.getWidgetAiMessage().last().should('contain.text', 'Persisted answer.');

        backofficeAssistantPage.newChat();
        backofficeAssistantPage.getWidgetMessages().should('contain.text', backofficeAssistantPage.getGreetingText());
        backofficeAssistantPage.getWidgetUserMessage().should('not.exist');
        cy.get('@assistantDetail.all').should('have.length', 0);
      }
    );

    it(
      'sanitizes a streamed ai_response: markdown renders but script/onerror payloads are stripped',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptPromptWithSseEvents([
          { type: 'ai_response', message: staticFixtures.xssPromptPayload, conversation_reference: '' },
        ]);

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        cy.window().then((win) => {
          (win as unknown as Record<string, unknown>).__baXss = undefined;
        });

        backofficeAssistantPage.typeMessage('Render untrusted markup');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt');

        backofficeAssistantPage
          .getWidgetAiMessage()
          .last()
          .within((): void => {
            cy.get('strong').should('contain.text', 'bold');
            cy.get('script').should('not.exist');
            cy.get('[onerror]').should('not.exist');
          });

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
        backofficeAssistantPage.getWidgetRetryButton().should('be.visible').click();

        cy.wait('@assistantPrompt').then((interception): void => {
          const body = interception.request.body;
          const serialized = typeof body === 'string' ? body : JSON.stringify(body);
          expect(serialized).to.include('Retry me');
        });
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
        backofficeAssistantPage.getWidgetAttachmentChip().should('have.length', 1);

        backofficeAssistantPage.removeFirstAttachmentChip();
        backofficeAssistantPage.getWidgetAttachmentChip().should('have.length', 0);

        backofficeAssistantPage.typeMessage('No attachment should be sent');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt').then((interception): void => {
          const body = interception.request.body;
          const serialized = typeof body === 'string' ? body : JSON.stringify(body);
          expect(serialized).to.not.include('attachments');
        });
        backofficeAssistantPage.getWidgetMessageAttachmentPill().should('not.exist');
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
        backofficeAssistantPage.getWidgetAttachmentChip().should('have.length', 2);

        backofficeAssistantPage.typeMessage('Describe both attachments');
        backofficeAssistantPage.send();

        cy.wait('@assistantPrompt').then((interception): void => {
          const body = interception.request.body;
          const parsed = typeof body === 'string' ? JSON.parse(body) : body;
          expect(parsed.attachments).to.have.length(2);
        });
        backofficeAssistantPage.getWidgetMessageAttachmentPill().should('have.length', 2);
      }
    );

    it(
      'selecting an unsupported file type is rejected client-side with an inline notice and no attachment chip',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.attachFile(staticFixtures.unsupportedAttachmentPath);

        backofficeAssistantPage.getWidgetAttachmentChip().should('have.length', 0);
        backofficeAssistantPage
          .getWidgetMessages()
          .should('contain.text', backofficeAssistantPage.getUnsupportedFileTypeText());
      }
    );

    it(
      'lists conversations in the histories panel and removes a row on delete',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptHistoriesWith(
          [
            {
              conversation_reference: 'cypress-stub-conv-a',
              name: staticFixtures.historyEntryName,
              agent: backofficeAssistantPage.getOrderManagementAgentLabel(),
            },
            { conversation_reference: 'cypress-stub-conv-b', name: 'Second stubbed conversation', agent: '' },
          ],
          staticFixtures.enabledAgents
        );
        backofficeAssistantPage.interceptDeleteSuccess();

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();
        backofficeAssistantPage.openHistories();

        cy.wait('@assistantHistories');
        backofficeAssistantPage.getWidgetHistoryItem().should('have.length', 2);
        backofficeAssistantPage.getWidgetHistoryItem().first().should('contain.text', staticFixtures.historyEntryName);

        backofficeAssistantPage.deleteFirstHistoryItem();

        cy.wait('@assistantDelete').then((interception): void => {
          expect(interception.response?.statusCode).to.eq(200);
          expect(JSON.stringify(interception.response?.body)).to.include('success');
        });
        backofficeAssistantPage.getWidgetHistoryItem().should('have.length', 1);
      }
    );

    it(
      'the histories panel shows the empty-state notice when no conversations exist',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.interceptHistoriesWith([], staticFixtures.enabledAgents);

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();
        backofficeAssistantPage.openHistories();

        cy.wait('@assistantHistories');
        backofficeAssistantPage.getWidgetHistoryItem().should('have.length', 0);
        backofficeAssistantPage
          .getWidgetHistoriesEmpty()
          .should('be.visible')
          .and('contain.text', backofficeAssistantPage.getHistoriesEmptyText());
      }
    );

    it(
      'the assistant endpoints reject unauthorized/invalid requests with the documented status contract',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitDashboard();

        const detailUrl = backofficeAssistantPage.getBackofficeAbsoluteUrl(
          backofficeAssistantPage.repositoryDetailPath()
        );
        const deleteUrl = backofficeAssistantPage.getBackofficeAbsoluteUrl(
          backofficeAssistantPage.repositoryDeletePath()
        );
        const promptUrl = backofficeAssistantPage.getBackofficeAbsoluteUrl(
          backofficeAssistantPage.repositoryPromptPath()
        );
        const invalidToken = backofficeAssistantPage.getInvalidCsrfToken();
        const unknownReference = staticFixtures.unknownConversationReference;

        const contract: Array<{
          description: string;
          request: Partial<Cypress.RequestOptions>;
          expectedStatus: number;
        }> = [
          {
            description: 'conversation detail without a reference is a 400',
            request: { method: 'GET', url: detailUrl },
            expectedStatus: 400,
          },
          {
            description: 'conversation detail with an unknown reference is a 404',
            request: {
              method: 'GET',
              url: `${detailUrl}?conversationReference=${encodeURIComponent(unknownReference)}`,
            },
            expectedStatus: 404,
          },
          {
            description: 'conversation delete with an invalid CSRF token is a 403',
            request: {
              method: 'POST',
              url: deleteUrl,
              body: { conversation_reference: unknownReference, _token: invalidToken },
            },
            expectedStatus: 403,
          },
          {
            description: 'prompt with an invalid CSRF token is a 403',
            request: {
              method: 'POST',
              url: promptUrl,
              body: { prompt: 'Should never reach the provider', _token: invalidToken },
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
          expect(csrfToken, 'CSRF token exposed to the widget').to.have.length.greaterThan(0);

          cy.request({
            method: 'POST',
            url: deleteUrl,
            failOnStatusCode: false,
            body: { conversation_reference: unknownReference, _token: csrfToken },
          }).then((response): void => {
            expect(response.status, 'valid-token delete of an unknown reference is a 404').to.eq(404);
          });
        });
      }
    );

    it(
      'the prompt endpoint streams a resolved validation error (no 500, no raw glossary key) for each invalid payload',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitDashboard();

        const promptUrl = backofficeAssistantPage.getBackofficeAbsoluteUrl(
          backofficeAssistantPage.repositoryPromptPath()
        );

        backofficeAssistantPage.readCsrfToken().then((csrfToken): void => {
          expect(csrfToken, 'CSRF token exposed to the widget').to.have.length.greaterThan(0);

          const tooManyAttachments = Array.from({ length: staticFixtures.attachmentMaxCount + 1 }, () => ({
            mediaType: 'image/png',
            content: 'QUJD',
          }));

          const invalidPayloads: Array<{ description: string; body: Record<string, unknown>; message: string }> = [
            {
              description: 'empty prompt',
              body: { prompt: '', _token: csrfToken },
              message: staticFixtures.promptRequiredValidationMessage,
            },
            {
              description: 'unsupported attachment media type',
              body: {
                prompt: 'Describe this file',
                _token: csrfToken,
                attachments: [{ mediaType: 'application/zip', content: 'QUJD' }],
              },
              message: staticFixtures.attachmentUnsupportedMediaTypeMessage,
            },
            {
              description: 'attachment count exceeded',
              body: { prompt: 'Describe these files', _token: csrfToken, attachments: tooManyAttachments },
              message: staticFixtures.attachmentCountExceededMessage,
            },
          ];

          invalidPayloads.forEach(({ description, body, message }): void => {
            cy.request({ method: 'POST', url: promptUrl, failOnStatusCode: false, body }).then((response): void => {
              expect(response.status, `${description}: streamed, not a 500`).to.eq(200);

              const rawBody = typeof response.body === 'string' ? response.body : JSON.stringify(response.body);
              expect(rawBody, `${description}: SSE stream carries an error event`).to.include('"type":"error"');
              expect(rawBody, `${description}: validation message is resolved`).to.include(message);
              expect(rawBody, `${description}: no unresolved glossary key leaks`).to.not.include(
                backofficeAssistantPage.getValidationGlossaryKey()
              );
            });
          });
        });
      }
    );

    it(
      'when disabled, every assistant endpoint returns 403 and the widget is not injected',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.disableAssistant();

        const indexUrl = backofficeAssistantPage.getBackofficeAbsoluteUrl(
          backofficeAssistantPage.getHistoriesEndpointPath()
        );
        const detailUrl = backofficeAssistantPage.getBackofficeAbsoluteUrl(
          backofficeAssistantPage.repositoryDetailPath()
        );

        [indexUrl, detailUrl].forEach((url): void => {
          cy.request({
            method: 'GET',
            url,
            failOnStatusCode: false,
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
          }).then((response): void => {
            expect(response.status, 'disabled assistant endpoint is a 403').to.eq(403);
          });
        });

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.getWidgetToggle().should('not.exist');
        backofficeAssistantPage.getWidgetPanel().should('not.exist');

        backofficeAssistantPage.enableAssistant();
      }
    );

    describe('real AI provider flow (full, requires provider token)', { tags: ['@demo-full'] }, (): void => {
      const REAL_FLOW_TIMEOUT = 15000;
      const AWS_REAL_FLOW_TIMEOUT = 45000;

      it(
        'a real prompt streams an assistant answer that renders as a non-empty AI message bubble',
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
            .getWidgetAiMessage({ timeout: REAL_FLOW_TIMEOUT })
            .should('have.length.at.least', 2)
            .last()
            .should('not.be.empty');
          backofficeAssistantPage.getWidgetUserMessage().should('contain.text', staticFixtures.simplePrompt);
          backofficeAssistantPage.getWidgetInput().should('not.be.disabled');
          backofficeAssistantPage.getWidgetRetryButton().should('not.exist');
        }
      );

      it(
        'a persisted conversation reloads its prior user and assistant messages from the history detail endpoint',
        { tags: ['@demo-full'] },
        function (): void {
          skipUnlessAiProviderEnabled(this);

          backofficeAssistantPage.interceptRealPrompt();
          backofficeAssistantPage.interceptHistories();
          backofficeAssistantPage.interceptDetail();
          backofficeAssistantPage.visitDashboard();
          backofficeAssistantPage.openPanel();

          backofficeAssistantPage.typeMessage(staticFixtures.simplePrompt);
          backofficeAssistantPage.send();
          cy.wait('@assistantRealPrompt', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);
          backofficeAssistantPage.getWidgetAiMessage({ timeout: REAL_FLOW_TIMEOUT }).should('have.length.at.least', 2);

          backofficeAssistantPage.newChat();
          backofficeAssistantPage.openHistories();

          cy.wait('@assistantHistories', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);
          backofficeAssistantPage.getWidgetHistoryItem().should('have.length.at.least', 1);

          backofficeAssistantPage.clickFirstHistoryItem();

          cy.wait('@assistantDetail', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);
          backofficeAssistantPage.getWidgetUserMessage().should('have.length.at.least', 1);
          backofficeAssistantPage.getWidgetAiMessage().should('have.length.at.least', 1);
        }
      );

      it(
        'deleting a conversation this spec created removes its entry from the history list',
        { tags: ['@demo-full'] },
        function (): void {
          skipUnlessAiProviderEnabled(this);

          backofficeAssistantPage.interceptRealPrompt();
          backofficeAssistantPage.interceptHistories();
          backofficeAssistantPage.interceptDelete();
          backofficeAssistantPage.visitDashboard();
          backofficeAssistantPage.openPanel();

          backofficeAssistantPage.typeMessage(staticFixtures.simplePrompt);
          backofficeAssistantPage.send();
          cy.wait('@assistantRealPrompt', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);
          backofficeAssistantPage.getWidgetAiMessage({ timeout: REAL_FLOW_TIMEOUT }).should('have.length.at.least', 2);

          backofficeAssistantPage.newChat();
          backofficeAssistantPage.openHistories();
          cy.wait('@assistantHistories', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);

          backofficeAssistantPage
            .getWidgetHistoryItem()
            .should('have.length.at.least', 1)
            .then(($items): void => {
              const initialCount = $items.length;

              backofficeAssistantPage.deleteFirstHistoryItem();

              cy.wait('@assistantDelete', { timeout: REAL_FLOW_TIMEOUT }).then((interception): void => {
                expect(interception.response?.statusCode).to.be.within(200, 299);
                expect(JSON.stringify(interception.response?.body)).to.include('success');
              });

              backofficeAssistantPage.getWidgetHistoryItem().should('have.length', initialCount - 1);
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

          backofficeAssistantPage
            .getWidgetToolCallMessage({ timeout: REAL_FLOW_TIMEOUT })
            .should('have.length.at.least', 1);
          backofficeAssistantPage
            .getWidgetToolCallMessage()
            .first()
            .find(backofficeAssistantPage.getWidgetToolCallNameSelector())
            .should('exist');
          backofficeAssistantPage.getWidgetAiMessage().should('have.length.at.least', 2);
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
          backofficeAssistantPage.getWidgetAttachmentChipName().should('be.visible');

          backofficeAssistantPage.typeMessage('Describe the attached image.');
          backofficeAssistantPage.send();

          cy.wait('@assistantRealPrompt', { timeout: REAL_FLOW_TIMEOUT }).then((interception): void => {
            expect(interception.response?.statusCode).to.be.within(200, 299);
            const body = interception.request.body;
            const serialized = typeof body === 'string' ? body : JSON.stringify(body);
            expect(serialized).to.include('attachments');
          });

          backofficeAssistantPage.getWidgetMessageAttachmentPill().should('exist');
          backofficeAssistantPage
            .getWidgetAiMessage({ timeout: REAL_FLOW_TIMEOUT })
            .should('have.length.at.least', 2)
            .last()
            .should('not.be.empty');
        }
      );

      it(
        'with Auto selected a real answer resolves an agent and populates the active-agent badge',
        { tags: ['@demo-full'] },
        function (): void {
          skipUnlessAiProviderEnabled(this);

          backofficeAssistantPage.interceptRealPrompt();
          backofficeAssistantPage.visitDashboard();
          backofficeAssistantPage.openPanel();

          backofficeAssistantPage.getWidgetAgentSelect().should('have.value', '');
          backofficeAssistantPage.typeMessage(staticFixtures.simplePrompt);
          backofficeAssistantPage.send();

          cy.wait('@assistantRealPrompt', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);

          backofficeAssistantPage.getWidgetAiMessage({ timeout: REAL_FLOW_TIMEOUT }).should('have.length.at.least', 2);
          backofficeAssistantPage.getWidgetAgentBadge().invoke('text').should('have.length.greaterThan', 0);
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

            backofficeAssistantPage.getWidgetRetryButton().should('be.visible').click();
            cy.wait('@assistantRealPrompt', { timeout: AWS_REAL_FLOW_TIMEOUT })
              .its('response.statusCode')
              .should('be.within', 200, 299);
          });

          backofficeAssistantPage
            .getWidgetAiMessage({ timeout: AWS_REAL_FLOW_TIMEOUT })
            .should('have.length.at.least', 2)
            .last()
            .should('not.be.empty');

          restoreBackofficeAssistantOpenAiVendor();

          auditLogsPage.assertNewestRowConfigurationIsFilterable('AWS');
        }
      );
    });
  }
);
