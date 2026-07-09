import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { AiConfigurationPage, AuditLogsPage, BackofficeAssistantPage } from '@pages/backoffice';
import { BackofficeAssistantDemoStaticFixtures } from '@interfaces/demo';

const BACKOFFICE_ASSISTANT_VENDOR_SETTING_KEY = 'ai_commerce:backoffice_assistant:ai_vendor:ai_configuration';
const BACKOFFICE_ASSISTANT_VENDOR_OPENAI_VALUE = 'AI_COMMERCE:AI_CONFIGURATION_BACKOFFICE_ASSISTANT_OPENAI';
const BACKOFFICE_ASSISTANT_VENDOR_AWS_VALUE = 'AI_COMMERCE:AI_CONFIGURATION_BACKOFFICE_ASSISTANT_AWS';

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

    /**
     * The widget persists its open/closed state (and conversation reference) across page loads in a
     * single localStorage key (`backoffice_assistant_state` — see spryker-zed-backoffice-assistant.js),
     * so a panel opened on the Dashboard by an earlier `it` re-renders open on the next page visited in
     * the same browser session, including the AI Configuration page. There it can visually cover the
     * "Save configuration" button and fail the click. Clearing the key before navigating there guarantees
     * the panel starts closed, without touching the shared page object (out of this spec's scope).
     */
    const clearWidgetPanelState = (): Cypress.Chainable =>
      cy.window().then((win): void => win.localStorage.removeItem('backoffice_assistant_state'));

    const restoreBackofficeAssistantOpenAiVendor = (): Cypress.Chainable => {
      clearWidgetPanelState();

      return aiConfigurationPage.setVendorConfiguration(
        'ai_commerce',
        'backoffice_assistant',
        BACKOFFICE_ASSISTANT_VENDOR_SETTING_KEY,
        BACKOFFICE_ASSISTANT_VENDOR_OPENAI_VALUE
      );
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
      'shows the assistant launcher and chat dialog panel on the Back Office dashboard',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitDashboard().its('response.statusCode').should('eq', 200);

        backofficeAssistantPage.getWidgetToggle().should('be.visible').and('contain.text', 'Assistant');
        backofficeAssistantPage.getWidgetPanel().should('exist').and('have.attr', 'role', 'dialog');
      }
    );

    it(
      'assistant is injected globally — the launcher also appears on a different Back Office page (Sales)',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitSales().its('response.statusCode').should('eq', 200);

        backofficeAssistantPage.getWidgetToggle().should('be.visible').and('contain.text', 'Assistant');
      }
    );

    it(
      'clicking the launcher opens the chat panel, hides the launcher, shows the greeting and reveals the core controls',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitDashboard();

        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.getWidgetToggle().should('not.be.visible');
        backofficeAssistantPage.getWidgetMessages().should('contain.text', 'How can I help you today?');
        backofficeAssistantPage.getWidgetAgentSelect().should('be.visible');
        backofficeAssistantPage
          .getWidgetInput()
          .should('be.visible')
          .and('have.attr', 'placeholder', 'Ask me anything...');
        backofficeAssistantPage.getWidgetSend().should('be.visible');
        backofficeAssistantPage.getWidgetHistoryButton().should('be.visible');
        backofficeAssistantPage.getWidgetNewChat().should('be.visible');
        backofficeAssistantPage.getWidgetAttach().should('be.visible');
      }
    );

    it(
      'the agent picker lists Auto plus the config-enabled agents and selecting one updates the active-agent badge',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        backofficeAssistantPage.getWidgetAgentSelect().find('option').first().should('contain.text', 'Auto');
        backofficeAssistantPage.getWidgetAgentSelect().find('option').should('contain.text', 'Order Management');

        backofficeAssistantPage.selectAgent('Order Management');

        backofficeAssistantPage.getWidgetAgentSelect().should('have.value', 'Order Management');
        backofficeAssistantPage.getWidgetAgentBadge().should('contain.text', 'Order Management');
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
        backofficeAssistantPage.getWidgetMessages().should('contain.text', 'Request failed with status 503');
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
        backofficeAssistantPage.getWidgetMessages().should('contain.text', 'Request failed with status 503');
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
        backofficeAssistantPage.getWidgetMessages().should('contain.text', 'Request failed with status 503');
        backofficeAssistantPage.getWidgetContextChip().should('not.exist');
        backofficeAssistantPage.getWidgetInput().should('not.be.disabled');
      }
    );

    it(
      'the agent picker lists every config-enabled agent as a distinct selectable option',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.openPanel();

        staticFixtures.enabledAgents.forEach((agentName): void => {
          backofficeAssistantPage.getWidgetAgentSelect().find('option').should('contain.text', agentName);
        });
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
        backofficeAssistantPage.getWidgetMessages().should('contain.text', 'How can I help you today?');
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
        backofficeAssistantPage.getWidgetMessages().should('contain.text', 'How can I help you today?');
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
        backofficeAssistantPage.getWidgetMessages().should('contain.text', 'Unsupported file type');
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
              agent: 'Order Management',
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
          .and('contain.text', 'No conversations yet');
      }
    );

    it(
      'conversation detail rejects a missing reference with 400 and an unknown reference with 404',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitDashboard();

        const detailUrl = backofficeAssistantPage.getBackofficeAbsoluteUrl(
          backofficeAssistantPage.repositoryDetailPath()
        );

        cy.request({ method: 'GET', url: detailUrl, failOnStatusCode: false }).then((response): void => {
          expect(response.status).to.eq(400);
        });

        cy.request({
          method: 'GET',
          url: `${detailUrl}?conversationReference=${encodeURIComponent(staticFixtures.unknownConversationReference)}`,
          failOnStatusCode: false,
        }).then((response): void => {
          expect(response.status).to.eq(404);
        });
      }
    );

    it(
      'conversation delete rejects an invalid CSRF token with 403 and a valid-token unknown reference with 404',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitDashboard();

        const deleteUrl = backofficeAssistantPage.getBackofficeAbsoluteUrl(
          backofficeAssistantPage.repositoryDeletePath()
        );

        cy.request({
          method: 'POST',
          url: deleteUrl,
          failOnStatusCode: false,
          body: { conversation_reference: staticFixtures.unknownConversationReference, _token: 'invalid-token' },
        }).then((response): void => {
          expect(response.status).to.eq(403);
        });

        backofficeAssistantPage.readCsrfToken().then((csrfToken): void => {
          expect(csrfToken, 'CSRF token exposed to the widget').to.have.length.greaterThan(0);

          cy.request({
            method: 'POST',
            url: deleteUrl,
            failOnStatusCode: false,
            body: { conversation_reference: staticFixtures.unknownConversationReference, _token: csrfToken },
          }).then((response): void => {
            expect(response.status).to.eq(404);
          });
        });
      }
    );

    it(
      'the prompt endpoint rejects a request with no valid CSRF token with 403',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitDashboard();

        const promptUrl = backofficeAssistantPage.getBackofficeAbsoluteUrl(
          backofficeAssistantPage.repositoryPromptPath()
        );

        cy.request({
          method: 'POST',
          url: promptUrl,
          failOnStatusCode: false,
          body: { prompt: 'Should never reach the provider', _token: 'invalid-token' },
        }).then((response): void => {
          expect(response.status).to.eq(403);
        });
      }
    );

    it(
      'the prompt endpoint streams a resolved validation error for an empty prompt, without a 500',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitDashboard();

        const promptUrl = backofficeAssistantPage.getBackofficeAbsoluteUrl(
          backofficeAssistantPage.repositoryPromptPath()
        );

        backofficeAssistantPage.readCsrfToken().then((csrfToken): void => {
          expect(csrfToken, 'CSRF token exposed to the widget').to.have.length.greaterThan(0);

          cy.request({
            method: 'POST',
            url: promptUrl,
            failOnStatusCode: false,
            body: { prompt: '', _token: csrfToken },
          }).then((response): void => {
            expect(response.status).to.eq(200);

            const rawBody = typeof response.body === 'string' ? response.body : JSON.stringify(response.body);

            expect(rawBody, 'SSE stream carries an error event').to.include('"type":"error"');
            expect(rawBody, 'validation message is resolved, not a raw glossary key').to.include(
              staticFixtures.promptRequiredValidationMessage
            );
            expect(rawBody, 'no unresolved glossary key leaks into the stream').to.not.include(
              'backoffice_assistant.validation'
            );
          });
        });
      }
    );

    it(
      'the prompt endpoint streams a resolved validation error for an unsupported attachment media type',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitDashboard();

        const promptUrl = backofficeAssistantPage.getBackofficeAbsoluteUrl(
          backofficeAssistantPage.repositoryPromptPath()
        );

        backofficeAssistantPage.readCsrfToken().then((csrfToken): void => {
          expect(csrfToken, 'CSRF token exposed to the widget').to.have.length.greaterThan(0);

          cy.request({
            method: 'POST',
            url: promptUrl,
            failOnStatusCode: false,
            body: {
              prompt: 'Describe this file',
              _token: csrfToken,
              attachments: [{ mediaType: 'application/zip', content: 'QUJD' }],
            },
          }).then((response): void => {
            expect(response.status).to.eq(200);

            const rawBody = typeof response.body === 'string' ? response.body : JSON.stringify(response.body);

            expect(rawBody, 'SSE stream carries an error event').to.include('"type":"error"');
            expect(rawBody, 'attachment validation message is resolved, not a raw glossary key').to.include(
              staticFixtures.attachmentUnsupportedMediaTypeMessage
            );
            expect(rawBody, 'no unresolved glossary key leaks into the stream').to.not.include(
              'backoffice_assistant.validation'
            );
          });
        });
      }
    );

    it(
      'the prompt endpoint streams a resolved validation error when the attachment count is exceeded',
      { tags: ['@demo-smoke'] },
      (): void => {
        backofficeAssistantPage.visitDashboard();

        const promptUrl = backofficeAssistantPage.getBackofficeAbsoluteUrl(
          backofficeAssistantPage.repositoryPromptPath()
        );

        backofficeAssistantPage.readCsrfToken().then((csrfToken): void => {
          expect(csrfToken, 'CSRF token exposed to the widget').to.have.length.greaterThan(0);

          const attachments = Array.from({ length: staticFixtures.attachmentMaxCount + 1 }, () => ({
            mediaType: 'image/png',
            content: 'QUJD',
          }));

          cy.request({
            method: 'POST',
            url: promptUrl,
            failOnStatusCode: false,
            body: { prompt: 'Describe these files', _token: csrfToken, attachments },
          }).then((response): void => {
            expect(response.status).to.eq(200);

            const rawBody = typeof response.body === 'string' ? response.body : JSON.stringify(response.body);

            expect(rawBody, 'SSE stream carries an error event').to.include('"type":"error"');
            expect(rawBody, 'attachment count message is resolved, not a raw glossary key').to.include(
              staticFixtures.attachmentCountExceededMessage
            );
            expect(rawBody, 'no unresolved glossary key leaks into the stream').to.not.include(
              'backoffice_assistant.validation'
            );
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

        cy.request({
          method: 'GET',
          url: indexUrl,
          failOnStatusCode: false,
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        }).then((response): void => {
          expect(response.status).to.eq(403);
        });

        cy.request({
          method: 'GET',
          url: detailUrl,
          failOnStatusCode: false,
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        }).then((response): void => {
          expect(response.status).to.eq(403);
        });

        backofficeAssistantPage.visitDashboard();
        backofficeAssistantPage.getWidgetToggle().should('not.exist');
        backofficeAssistantPage.getWidgetPanel().should('not.exist');

        backofficeAssistantPage.enableAssistant();
      }
    );

    describe('real AI provider flow (full, requires provider token)', { tags: ['@demo-full'] }, (): void => {
      const REAL_FLOW_TIMEOUT = 15000;
      // AWS Bedrock is slower than OpenAI in this env (observed ~35-45s), so the AWS case below waits
      // longer than the OpenAI REAL_FLOW_TIMEOUT.
      const AWS_REAL_FLOW_TIMEOUT = 45000;

      it(
        'a real prompt streams an assistant answer that renders as a non-empty AI message bubble',
        { tags: ['@demo-full'] },
        function (): void {
          if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
            this.skip();
          }

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
          if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
            this.skip();
          }

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
          if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
            this.skip();
          }

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
          if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
            this.skip();
          }

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
          if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
            this.skip();
          }

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
          if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
            this.skip();
          }

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
          if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
            this.skip();
          }

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

      // Tracks whether this suite actually switched the vendor to AWS, so the after() safety-net below
      // only restores OpenAI when the switch really happened. Cypress.env('DEMO_AI_PROVIDER_ENABLED')
      // alone is not a reliable guard for that hook: this repo's .env hardcodes it to 1, so it is truthy
      // even on a @demo-smoke-only run where every @demo-full `it` (and the login in beforeEach) is
      // grep-tag-filtered to pending and never executes.
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
          if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
            this.skip();
          }

          switchedToAws = true;
          clearWidgetPanelState();
          aiConfigurationPage.setVendorConfiguration(
            'ai_commerce',
            'backoffice_assistant',
            BACKOFFICE_ASSISTANT_VENDOR_SETTING_KEY,
            BACKOFFICE_ASSISTANT_VENDOR_AWS_VALUE
          );

          backofficeAssistantPage.interceptRealPrompt();
          backofficeAssistantPage.visitDashboard();
          backofficeAssistantPage.openPanel();

          backofficeAssistantPage.selectAgent(staticFixtures.orderManagement.agentName);
          backofficeAssistantPage.typeMessage(staticFixtures.orderManagement.prompt);
          backofficeAssistantPage.send();

          // A single real call against Bedrock can transiently fail or hang under this env's latency;
          // bound-retry the send like a real user re-sending, rather than hard-failing on one shot.
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

          clearWidgetPanelState();
          aiConfigurationPage.setVendorConfiguration(
            'ai_commerce',
            'backoffice_assistant',
            BACKOFFICE_ASSISTANT_VENDOR_SETTING_KEY,
            BACKOFFICE_ASSISTANT_VENDOR_OPENAI_VALUE
          );

          // The prompt above is logged as an AI-interaction-log row. Read the newest row's
          // configuration_name (the resolved Bedrock config, e.g. "...BACKOFFICE_ASSISTANT_AWS") rather
          // than hardcoding it, then prove the audit-log table is actually filterable by that value:
          // every row the filtered fetch returns must carry that same configuration_name, and the
          // filtered count can never exceed the unfiltered one.
          auditLogsPage.fetchRecentTableData().then(({ recordsTotal: unfilteredTotal, rows: recentRows }): void => {
            const awsConfigurationName = auditLogsPage.getRowConfigurationName(recentRows[0]);
            expect(awsConfigurationName, 'newest audit-log row carries the AWS configuration name').to.include('AWS');

            auditLogsPage
              .fetchTableDataFilteredByConfiguration(awsConfigurationName)
              .then(({ recordsTotal: filteredTotal, rows: filteredRows }): void => {
                expect(
                  filteredRows,
                  'filter by the AWS configuration returns at least one row'
                ).to.have.length.at.least(1);
                filteredRows.forEach((row): void => {
                  expect(auditLogsPage.getRowConfigurationName(row)).to.eq(awsConfigurationName);
                });
                expect(filteredTotal, 'filtered count never exceeds the unfiltered count').to.be.at.most(
                  unfilteredTotal
                );
              });
          });
        }
      );
    });
  }
);
