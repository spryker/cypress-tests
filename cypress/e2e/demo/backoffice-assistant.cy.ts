import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { BackofficeAssistantPage } from '@pages/backoffice';
import { BackofficeAssistantDemoStaticFixtures } from '@interfaces/demo';

describe(
  'Backoffice Assistant - global Back Office chat widget',
  {
    tags: ['@demo', '@backoffice-assistant', '@ai-commerce'],
  },
  (): void => {
    const userLoginScenario = container.get(UserLoginScenario);
    const backofficeAssistantPage = container.get(BackofficeAssistantPage);

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

    it('assistant launcher and its chat dialog panel are present on the Back Office dashboard (page loads HTTP 200)', (): void => {
      backofficeAssistantPage.visitDashboard().its('response.statusCode').should('eq', 200);

      backofficeAssistantPage.getWidgetToggle().should('be.visible').and('contain.text', 'Assistant');
      backofficeAssistantPage.getWidgetPanel().should('exist').and('have.attr', 'role', 'dialog');
    });

    it('assistant is injected globally — the launcher also appears on a different Back Office page (Sales)', (): void => {
      backofficeAssistantPage.visitSales().its('response.statusCode').should('eq', 200);

      backofficeAssistantPage.getWidgetToggle().should('be.visible').and('contain.text', 'Assistant');
    });

    it('clicking the launcher opens the chat panel, hides the launcher, shows the greeting and reveals the core controls', (): void => {
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
    });

    it('the agent picker lists Auto plus the config-enabled agents and selecting one updates the active-agent badge', (): void => {
      backofficeAssistantPage.visitDashboard();
      backofficeAssistantPage.openPanel();

      backofficeAssistantPage.getWidgetAgentSelect().find('option').first().should('contain.text', 'Auto');
      backofficeAssistantPage.getWidgetAgentSelect().find('option').should('contain.text', 'Order Management');

      backofficeAssistantPage.selectAgent('Order Management');

      backofficeAssistantPage.getWidgetAgentSelect().should('have.value', 'Order Management');
      backofficeAssistantPage.getWidgetAgentBadge().should('contain.text', 'Order Management');
    });

    it('the message input accepts typed text', (): void => {
      backofficeAssistantPage.visitDashboard();
      backofficeAssistantPage.openPanel();

      backofficeAssistantPage.typeMessage('List the latest orders');

      backofficeAssistantPage.getWidgetInput().should('have.value', 'List the latest orders');
    });

    it('sending a message issues the assistant prompt POST with the message payload and recovers gracefully when the provider fails', (): void => {
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
    });

    it('attaching a file shows it as an attachment chip and the sent prompt POST carries the attachment, recovering gracefully when the provider fails', (): void => {
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
    });

    it('adding the page form as context shows a context chip and prefixes the sent prompt POST with the form context, recovering gracefully when the provider fails', (): void => {
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
    });
  }
);
