import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { AiWorkflowsPage } from '@pages/backoffice';
import { AiWorkflowsDemoStaticFixtures } from '@interfaces/demo';

describe(
  'AI Workflows - Back Office workflow runs list',
  {
    tags: ['@demo', '@ai-workflows', '@ai-foundation'],
  },
  (): void => {
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

    it('opens the Workflows page (HTTP 200) and shows the "Workflows" section heading and "Workflow Items" widget title', (): void => {
      aiWorkflowsPage.visitAiWorkflows().its('response.statusCode').should('eq', 200);

      aiWorkflowsPage.getSectionTitle().should('contain.text', 'Workflows');
      aiWorkflowsPage.getWidgetTitle().should('contain.text', 'Workflow Items');
    });

    it('workflow-items table renders with all six expected column headers', (): void => {
      aiWorkflowsPage.visitAiWorkflows();

      aiWorkflowsPage.getTable().should('exist');
      aiWorkflowsPage.getTableHeaders().should('have.length', EXPECTED_COLUMN_HEADERS.length);

      EXPECTED_COLUMN_HEADERS.forEach((column): void => {
        aiWorkflowsPage.getColumnHeader(column.dataQa).should('exist').and('contain.text', column.label);
      });
    });
  }
);
