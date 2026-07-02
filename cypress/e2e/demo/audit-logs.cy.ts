import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { AuditLogsPage } from '@pages/backoffice';
import { AuditLogsDemoStaticFixtures } from '@interfaces/demo';

describe(
  'Audit Logs - Back Office AI interaction log',
  {
    tags: ['@demo', '@audit-logs', '@ai-foundation'],
  },
  (): void => {
    const userLoginScenario = container.get(UserLoginScenario);
    const auditLogsPage = container.get(AuditLogsPage);

    const EXPECTED_COLUMN_HEADERS: Array<{ dataQa: string; label: string }> = [
      { dataQa: 'spy_ai_interaction_log.prompt', label: 'Prompt' },
      { dataQa: 'spy_ai_interaction_log.conversation_reference', label: 'Conversation' },
      { dataQa: 'spy_ai_interaction_log.provider', label: 'Provider' },
      { dataQa: 'spy_ai_interaction_log.model', label: 'Model' },
      { dataQa: 'total_tokens', label: 'Total Tokens' },
      { dataQa: 'estimated_cost', label: 'Estimated cost' },
      { dataQa: 'spy_ai_interaction_log.configuration_name', label: 'Configuration' },
      { dataQa: 'spy_ai_interaction_log.is_successful', label: 'Status' },
      { dataQa: 'spy_ai_interaction_log.inference_time_ms', label: 'Inference (ms)' },
      { dataQa: 'spy_ai_interaction_log.created_at', label: 'Created At' },
    ];

    const EXPECTED_STATS_CARDS: Array<string> = [
      'Total Interactions',
      'Total Tokens',
      'Total estimated cost',
      'Success Rate',
      'Avg Inference Time',
    ];

    const SORTABLE_COLUMNS: Array<string> = [
      'spy_ai_interaction_log.configuration_name',
      'spy_ai_interaction_log.is_successful',
      'spy_ai_interaction_log.created_at',
    ];

    const NON_SORTABLE_COLUMNS: Array<string> = [
      'spy_ai_interaction_log.prompt',
      'spy_ai_interaction_log.conversation_reference',
      'spy_ai_interaction_log.provider',
      'spy_ai_interaction_log.model',
      'total_tokens',
      'estimated_cost',
      'spy_ai_interaction_log.inference_time_ms',
    ];

    let staticFixtures: AuditLogsDemoStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('Audit Logs page opens (HTTP 200) and shows the section heading', { tags: ['@demo-smoke'] }, (): void => {
      auditLogsPage.visitAuditLogs().its('response.statusCode').should('eq', 200);

      auditLogsPage.getSectionTitle().should('contain.text', 'Audit Logs');
    });

    it(
      'audit-log table renders all ten expected column headers, including the Estimated cost column',
      { tags: ['@demo-smoke'] },
      (): void => {
        auditLogsPage.visitAuditLogs();

        auditLogsPage.getTable().should('exist');
        auditLogsPage.getTableHeaders().should('have.length', EXPECTED_COLUMN_HEADERS.length);

        EXPECTED_COLUMN_HEADERS.forEach((column): void => {
          auditLogsPage.getColumnHeader(column.dataQa).should('exist').and('contain.text', column.label);
        });
      }
    );

    it(
      'shows the five summary stats cards, including the Total estimated cost card',
      { tags: ['@demo-smoke'] },
      (): void => {
        auditLogsPage.visitAuditLogs();

        auditLogsPage.getStatsCards().should('be.visible');
        auditLogsPage.getStatsCardTitles().should('have.length.at.least', EXPECTED_STATS_CARDS.length);

        EXPECTED_STATS_CARDS.forEach((cardTitle): void => {
          auditLogsPage.getStatsCards().should('contain.text', cardTitle);
        });
      }
    );

    it(
      'initializes a live DataTable whose data endpoint returns HTTP 200 JSON with the recordsTotal/recordsFiltered/data shape',
      { tags: ['@demo-smoke'] },
      (): void => {
        auditLogsPage.visitAndAwaitTableData().then((interception): void => {
          expect(interception.response?.statusCode).to.eq(200);
          expect(interception.response?.headers['content-type']).to.contain('application/json');

          const body = interception.response?.body;
          expect(body).to.have.property('draw');
          expect(body).to.have.property('recordsTotal');
          expect(body).to.have.property('recordsFiltered');
          expect(body).to.have.property('data');
          expect(body.data).to.be.an('array');
        });

        auditLogsPage.getTableWrapper().should('exist');
        auditLogsPage.getTableInfo().should('be.visible');
      }
    );

    it('loads the stats aggregation partial over AJAX with HTTP 200', { tags: ['@demo-smoke'] }, (): void => {
      auditLogsPage.visitAndAwaitTableData();

      auditLogsPage.waitForStats().its('response.statusCode').should('eq', 200);

      auditLogsPage.getStatsCards().should('contain.text', 'Total Interactions');
    });

    it(
      'marks Configuration, Status and Created At sortable and the remaining columns non-sortable',
      { tags: ['@demo-smoke'] },
      (): void => {
        auditLogsPage.visitAndAwaitTableData();

        SORTABLE_COLUMNS.forEach((column): void => {
          auditLogsPage.getSortableColumnHeader(column).should('exist');
        });

        NON_SORTABLE_COLUMNS.forEach((column): void => {
          auditLogsPage.getNonSortableColumnHeader(column).should('exist');
        });
      }
    );

    it(
      'changing the page-length control issues a fresh table data request that returns HTTP 200',
      { tags: ['@demo-smoke'] },
      (): void => {
        auditLogsPage.visitAndAwaitTableData();

        auditLogsPage.getLengthSelect().should('exist');
        auditLogsPage.aliasTableData('lengthChangeData');
        auditLogsPage.selectPageLength('50');

        cy.wait('@lengthChangeData').then((interception): void => {
          expect(interception.response?.statusCode).to.eq(200);
          expect(interception.request.url).to.contain('length=50');
        });
      }
    );

    it(
      'clicking the Created At sort header issues a fresh table data request that returns HTTP 200',
      { tags: ['@demo-smoke'] },
      (): void => {
        auditLogsPage.visitAndAwaitTableData();

        auditLogsPage.aliasTableData('sortChangeData');
        auditLogsPage.getSortableColumnHeader('spy_ai_interaction_log.created_at').click();

        cy.wait('@sortChangeData').its('response.statusCode').should('eq', 200);
      }
    );
  }
);
