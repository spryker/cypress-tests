import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { BackofficeAssistantPage } from '@pages/backoffice';
import { BackofficeAssistantDemoStaticFixtures } from '@interfaces/demo';

/**
 * Demo-only smoke coverage for the AI Commerce "Backoffice Assistant" feature (Back Office).
 *
 * Surface: a global AI chat widget injected into every Back Office page via
 * `src/Demo/Zed/Gui/Presentation/Layout/layout.twig`. It renders ONLY when the config flag
 * `ai_commerce:backoffice_assistant:general:is_enabled` is ON — default OFF — so the suite enables
 * the flag once (via the Configuration Management UI) before asserting the widget. Enabling a flag
 * is a plain config-save POST (`/configuration/manage/save`), NOT an AI provider call.
 *
 * Scope: confirm the widget shell is present/visible/clickable on BO pages and that it is injected
 * globally (present on more than one page). We assert the launcher + the closed panel's components
 * (agent select, input, send/history/new-chat/attach buttons) WITHOUT opening the panel and WITHOUT
 * sending a message — so nothing ever reaches `/ai-commerce/backoffice-assistant-prompt/index` (the
 * SSE provider endpoint). Static fixtures only — no dynamic fixtures, no CLI commands, no provider calls.
 *
 * NO AI provider interaction: no API token is ever entered, no chat message is ever sent.
 *
 * This spec lives in the isolated `demo` group: run it with `npm run cy:demo`. It is excluded from
 * every other run (`cy:ci`, `cy:run`, `cy:smoke`, `cy:ci:ssp`) and has its own CI step.
 */
describe(
  'backoffice assistant',
  {
    tags: ['@demo', '@backoffice-assistant', 'spryker-core-back-office'],
  },
  (): void => {
    if (!['b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the Backoffice Assistant demo feature ships only in b2b-mp', () => {});
      return;
    }

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

      // Precondition: the widget renders only when the feature flag is ON. Enable-if-not-enabled,
      // so the spec sets up its own state and stays green on a fresh env and on re-runs.
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
