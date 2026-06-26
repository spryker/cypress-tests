import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { AiWorkflowsPage } from '@pages/backoffice';
import { AiWorkflowsDemoStaticFixtures } from '@interfaces/demo';

/**
 * Demo-only smoke coverage for the AI Commerce "AI Workflows" feature (Back Office).
 *
 * Surface: Back Office → Intelligence → Workflows (`/ai-foundation/ai-workflow`, the AiFoundation
 * `AiWorkflowController::indexAction`). The page renders the "Workflow Items" widget wrapping the
 * Gui DataTable shell whose six columns are ID / Process Name / State / Created At / Updated At /
 * Actions.
 *
 * Scope: confirm the page loads (HTTP 200, no 500/crash) and renders its structure — the "Workflows"
 * section title, the "Workflow Items" widget title, and the table with all six column headers. The
 * table is empty in this environment (zero rows in `spy_ai_workflow_item`); per smoke discipline an
 * empty table is a PASS as long as the columns/structure render. This guards the upmerge regression
 * class where a dropped demo-only AiFoundation block breaks the screen.
 *
 * NO AI provider interaction: no API token is set, no prompt/image is sent, and the per-item manual
 * "Trigger Event" control (a CSRF-protected POST that would fire a state-machine transition and can
 * invoke AI processing) is never reached or submitted. That control only renders on a workflow
 * detail page for an item with a state-machine state — none exist here — and is out of smoke scope.
 * Static fixtures only — presence/visibility of the rendered chrome, not behavior.
 *
 * This spec lives in the isolated `demo` group: run it with `npm run cy:demo`. It is excluded from
 * every other run (`cy:ci`, `cy:run`, `cy:smoke`, `cy:ci:ssp`) and has its own CI step.
 */
describe(
  'ai workflows',
  {
    tags: ['@demo', '@ai-workflows', 'spryker-core-back-office'],
  },
  (): void => {
    if (!['b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the AI Workflows demo feature ships only in b2b-mp', () => {});
      return;
    }

    const userLoginScenario = container.get(UserLoginScenario);
    const aiWorkflowsPage = container.get(AiWorkflowsPage);

    const EXPECTED_COLUMN_HEADERS: Array<{ dataQa: string; label: string }> = [
      { dataQa: 'spy_ai_workflow_item.id_ai_workflow_item', label: 'ID' },
      { dataQa: 'process_name', label: 'Process Name' },
      { dataQa: 'state_name', label: 'State' },
      { dataQa: 'spy_ai_workflow_item.created_at', label: 'Created At' },
      { dataQa: 'spy_ai_workflow_item.updated_at', label: 'Updated At' },
      { dataQa: 'Actions', label: 'Actions' },
    ];

    let staticFixtures: AiWorkflowsDemoStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('loads the Workflows page with HTTP 200 and renders the section and widget titles', (): void => {
      aiWorkflowsPage.visitAiWorkflows().its('response.statusCode').should('eq', 200);

      aiWorkflowsPage.getSectionTitle().should('contain.text', 'Workflows');
      aiWorkflowsPage.getWidgetTitle().should('contain.text', 'Workflow Items');
    });

    it('renders the Workflow Items DataTable with all six columns', (): void => {
      aiWorkflowsPage.visitAiWorkflows();

      aiWorkflowsPage.getTable().should('exist');
      aiWorkflowsPage.getTableHeaders().should('have.length', EXPECTED_COLUMN_HEADERS.length);

      EXPECTED_COLUMN_HEADERS.forEach((column): void => {
        aiWorkflowsPage.getColumnHeader(column.dataQa).should('exist').and('contain.text', column.label);
      });
    });
  }
);
