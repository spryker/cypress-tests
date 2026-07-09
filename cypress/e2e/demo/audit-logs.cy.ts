import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { AuditLogsPage, SmartPimPage } from '@pages/backoffice';
import { AuditLogsDemoStaticFixtures } from '@interfaces/demo';

describe(
  'Audit Logs - Back Office AI interaction log',
  {
    tags: ['@demo', '@audit-logs', '@ai-foundation'],
  },
  (): void => {
    const userLoginScenario = container.get(UserLoginScenario);
    const auditLogsPage = container.get(AuditLogsPage);
    const smartPimPage = container.get(SmartPimPage);

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

    describe('real AI audit-log data (full, requires provider token)', { tags: ['@demo-full'] }, (): void => {
      const REAL_FLOW_TIMEOUT = 15000;

      it(
        'captures a self-seeded AI interaction as an audit-log row with populated provider/model/tokens/cost/status/inference fields',
        { tags: ['@demo-full'] },
        function (): void {
          if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
            this.skip();
          }

          // 1) Capture a baseline BEFORE seeding: the current unfiltered row count + the newest
          //    existing row's created_at. The endpoint is hit WITHOUT search[value] (that param 500s
          //    on this table), so this MUST return HTTP 200. Sort is created_at DESC, so row 0 is the
          //    newest existing interaction (or none, on an empty log).
          auditLogsPage.fetchRecentTableData().then((baseline): void => {
            const baselineTotal = baseline.recordsTotal;
            const baselineCreatedAt = auditLogsPage.getRowCreatedAt(baseline.rows[0]);

            // 2) Drive the Smart PIM improve-content REAL action — it logs one AI interaction from the
            //    Back Office product-edit page. We do NOT click the outer product Save, so no product
            //    mutation persists; only an append-only audit-log row is created.
            cy.intercept('POST', '**/ai-commerce/content-improver').as('contentImprover');

            smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);
            smartPimPage.openAllActionsPopover();
            smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());
            smartPimPage.clickImproveContent();

            cy.wait('@contentImprover', { timeout: REAL_FLOW_TIMEOUT })
              .its('response.statusCode')
              .should('be.within', 200, 299);

            smartPimPage.shouldBeOpenPopover(smartPimPage.getResponsePopover());
            smartPimPage.getResponseField().should('not.have.value', '');

            // 3) Fetch the table again (same no-search request). The rows created during THIS test's
            //    window are exactly the top `recordsTotal - baselineTotal` rows (sort is created_at
            //    DESC, and the log is append-only). This COUNT delta is immune to same-second
            //    created_at ties and stays decoupled from every other test's rows: adding/removing
            //    sibling tests never changes "the row I just created is a new one above my baseline".
            auditLogsPage.fetchRecentTableData().then((after): void => {
              const newRowCount = after.recordsTotal - baselineTotal;

              expect(newRowCount, 'at least one interaction was created after the baseline').to.be.at.least(1);

              const newRows = after.rows.slice(0, newRowCount);
              // The newest of the new rows is the interaction this test just seeded; sanity-check that
              // its created_at is not older than the baseline's newest row (append-only ordering holds).
              const row = newRows[0];
              expect(
                auditLogsPage.getRowCreatedAt(row) >= baselineCreatedAt,
                'the new row is at least as recent as the baseline newest row'
              ).to.eq(true);

              // total_tokens / inference_time_ms come back as integers, but parse defensively so a
              // formatted variant (e.g. "1 234" or "123 ms") still yields the leading numeric value.
              const toNumber = (value: unknown): number => parseInt(String(value ?? '').replace(/[^\d-]/g, ''), 10);

              const provider = String(row['spy_ai_interaction_log.provider'] ?? '');
              const model = String(row['spy_ai_interaction_log.model'] ?? '');
              const totalTokens = toNumber(row.total_tokens);
              const estimatedCost = String(row.estimated_cost ?? '');
              const status = String(row['spy_ai_interaction_log.is_successful'] ?? '');
              const inferenceMs = toNumber(row['spy_ai_interaction_log.inference_time_ms']);

              // 4) Assert the audit fields are POPULATED / well-formed — never the answer content.
              expect(provider.trim(), 'provider is captured').to.not.be.empty;
              expect(model.trim(), 'model is captured').to.not.be.empty;
              expect(totalTokens, 'total_tokens parses to a positive number').to.be.greaterThan(0);
              expect(estimatedCost.trim(), 'estimated_cost is present (formatted string)').to.not.be.empty;
              expect(status, 'status reflects a successful interaction').to.contain('Success');
              expect(inferenceMs, 'inference_time_ms parses to a non-negative number').to.be.at.least(0);
            });
          });
        }
      );
    });
  }
);
