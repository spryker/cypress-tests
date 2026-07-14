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

    const SORTABLE_COLUMNS: Array<string> = [
      'spy_ai_workflow_item.id_ai_workflow_item',
      'process_name',
      'state_name',
      'spy_ai_workflow_item.created_at',
      'spy_ai_workflow_item.updated_at',
    ];

    const NON_SORTABLE_COLUMNS: Array<string> = ['Actions'];

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

    it(
      'opens the Workflows page (HTTP 200) with the section heading, widget title and all six column headers',
      { tags: ['@demo-smoke'] },
      (): void => {
        aiWorkflowsPage.visitAiWorkflows().its('response.statusCode').should('eq', 200);

        aiWorkflowsPage.getSectionTitle().should('contain.text', aiWorkflowsPage.getSectionTitleText());
        aiWorkflowsPage.getWidgetTitle().should('contain.text', aiWorkflowsPage.getWidgetTitleText());

        aiWorkflowsPage.getTable().should('exist');
        aiWorkflowsPage.getTableHeaders().should('have.length', EXPECTED_COLUMN_HEADERS.length);
        EXPECTED_COLUMN_HEADERS.forEach((column): void => {
          aiWorkflowsPage.getColumnHeader(column.dataQa).should('exist').and('contain.text', column.label);
        });
      }
    );

    it(
      'initializes a live DataTable (HTTP 200 JSON with the draw/recordsTotal/recordsFiltered/data shape) and marks the five data columns sortable and Actions non-sortable',
      { tags: ['@demo-smoke'] },
      (): void => {
        aiWorkflowsPage.visitAndAwaitTableData().then((interception): void => {
          expect(interception.response?.statusCode).to.eq(200);
          expect(interception.response?.headers['content-type']).to.contain('application/json');

          const body = interception.response?.body;
          expect(body).to.have.property('draw');
          expect(body).to.have.property('recordsTotal');
          expect(body).to.have.property('recordsFiltered');
          expect(body).to.have.property('data');
          expect(body.data).to.be.an('array');
        });

        aiWorkflowsPage.getTableWrapper().should('exist');
        aiWorkflowsPage.getTableInfo().should('be.visible');

        SORTABLE_COLUMNS.forEach((column): void => {
          aiWorkflowsPage.getSortableColumnHeader(column).should('exist');
        });
        NON_SORTABLE_COLUMNS.forEach((column): void => {
          aiWorkflowsPage.getNonSortableColumnHeader(column).should('exist');
        });
      }
    );

    it(
      'the page-length control and the Created At sort header each issue a fresh table data request that returns HTTP 200',
      { tags: ['@demo-smoke'] },
      (): void => {
        aiWorkflowsPage.visitAndAwaitTableData();

        aiWorkflowsPage.getLengthSelect().should('exist');
        aiWorkflowsPage.aliasTableData('lengthChangeData');
        aiWorkflowsPage.selectPageLength('50');
        cy.wait('@lengthChangeData').then((interception): void => {
          expect(interception.response?.statusCode).to.eq(200);
          expect(interception.request.url).to.contain('length=50');
        });

        aiWorkflowsPage.aliasTableData('sortChangeData');
        aiWorkflowsPage.getSortableColumnHeader('spy_ai_workflow_item.created_at').click();
        cy.wait('@sortChangeData').its('response.statusCode').should('eq', 200);
      }
    );
  }
);
