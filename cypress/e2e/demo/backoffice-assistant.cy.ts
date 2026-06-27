import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { BackofficeAssistantPage } from '@pages/backoffice';
import { BackofficeAssistantDemoStaticFixtures } from '@interfaces/demo';

describe(
  'backoffice assistant',
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

    it('renders the assistant launcher on the Back Office dashboard with HTTP 200', (): void => {
      backofficeAssistantPage.visitDashboard().its('response.statusCode').should('eq', 200);

      backofficeAssistantPage.getWidgetToggle().should('be.visible').and('contain.text', 'Assistant');
      backofficeAssistantPage.getWidgetPanel().should('exist').and('have.attr', 'role', 'dialog');
    });

    it('renders the chat panel shell components (agent select, input, action buttons)', (): void => {
      backofficeAssistantPage.visitDashboard();

      backofficeAssistantPage.getWidgetAgentSelect().find('option').first().should('contain.text', 'Auto');
      backofficeAssistantPage.getWidgetInput().should('have.attr', 'placeholder', 'Ask me anything...');
      backofficeAssistantPage.getWidgetSend().should('exist');
      backofficeAssistantPage.getWidgetHistoryButton().should('exist');
      backofficeAssistantPage.getWidgetNewChat().should('exist');
      backofficeAssistantPage.getWidgetAttach().should('exist');
    });

    it('injects the assistant globally — present on a second Back Office page (Sales)', (): void => {
      backofficeAssistantPage.visitSales().its('response.statusCode').should('eq', 200);

      backofficeAssistantPage.getWidgetToggle().should('be.visible').and('contain.text', 'Assistant');
    });
  }
);
