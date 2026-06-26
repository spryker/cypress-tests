import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { AuditLogsPage } from '@pages/backoffice';
import { AuditLogsDemoStaticFixtures } from '@interfaces/demo';

/**
 * Demo-only smoke coverage for the AI Commerce "Audit Logs + estimated cost" feature (Back Office).
 *
 * Surface: Back Office → Intelligence → Audit Logs (`/ai-foundation/ai-interaction-log`, the
 * AiFoundation `AiInteractionLogController::indexAction`). The page renders the stats cards, the
 * filter form, and the Gui DataTable shell whose ten columns include the demo-only "Estimated cost"
 * (computed from per-provider token prices).
 *
 * Scope: confirm the page loads (HTTP 200, no 500/crash) and renders its structure — section title,
 * the five stats cards (incl. "Total estimated cost"), and the table with all ten column headers
 * (Provider, Model, Total Tokens, Estimated cost, Status, Inference (ms) …). The table is empty in
 * this environment (no AI interactions logged); per smoke discipline an empty table is a PASS as
 * long as the columns/structure render. This guards the upmerge regression class where a dropped
 * demo-only AiFoundation block breaks the screen.
 *
 * NO AI provider interaction: no API token is set, no prompt/image is sent, no provider POST is
 * triggered, and AI-response correctness is never asserted. Static fixtures only — presence/
 * visibility of the rendered chrome, not behavior.
 *
 * This spec lives in the isolated `demo` group: run it with `npm run cy:demo`. It is excluded from
 * every other run (`cy:ci`, `cy:run`, `cy:smoke`, `cy:ci:ssp`) and has its own CI step.
 */
describe(
  'audit logs',
  {
    tags: ['@demo', '@audit-logs', 'spryker-core-back-office'],
  },
  (): void => {
    if (!['b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the Audit Logs demo feature ships only in b2b-mp', () => {});
      return;
    }

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

    it('loads the Audit Logs page with HTTP 200 and renders the section title', (): void => {
      auditLogsPage.visitAuditLogs().its('response.statusCode').should('eq', 200);

      auditLogsPage.getSectionTitle().should('contain.text', 'Audit Logs');
    });

    it('renders the DataTable with all ten columns including the demo-only Estimated cost', (): void => {
      auditLogsPage.visitAuditLogs();

      auditLogsPage.getTable().should('exist');
      auditLogsPage.getTableHeaders().should('have.length', EXPECTED_COLUMN_HEADERS.length);

      EXPECTED_COLUMN_HEADERS.forEach((column): void => {
        auditLogsPage.getColumnHeader(column.dataQa).should('exist').and('contain.text', column.label);
      });
    });

    it('renders the five stats cards including Total estimated cost', (): void => {
      auditLogsPage.visitAuditLogs();

      auditLogsPage.getStatsCards().should('be.visible');
      auditLogsPage.getStatsCardTitles().should('have.length', EXPECTED_STATS_CARDS.length);

      EXPECTED_STATS_CARDS.forEach((cardTitle): void => {
        auditLogsPage.getStatsCards().should('contain.text', cardTitle);
      });
    });
  }
);
