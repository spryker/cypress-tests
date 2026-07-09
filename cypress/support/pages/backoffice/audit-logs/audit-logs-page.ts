import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { AuditLogsRepository } from './audit-logs-repository';

@injectable()
@autoWired
export class AuditLogsPage extends BackofficePage {
  @inject(AuditLogsRepository) private repository: AuditLogsRepository;

  protected PAGE_URL = '/ai-foundation/ai-interaction-log';

  private TABLE_DATA_URL = '**/ai-foundation/ai-interaction-log/table**';

  private STATS_URL = '**/ai-foundation/ai-interaction-log/stats**';

  visitAuditLogs = (): Cypress.Chainable => {
    cy.intercept('GET', '**/ai-foundation/ai-interaction-log').as('auditLogsDocument');
    cy.visitBackoffice(this.PAGE_URL);

    return cy.wait('@auditLogsDocument');
  };

  visitAndAwaitTableData = (): Cypress.Chainable => {
    cy.intercept('GET', this.TABLE_DATA_URL).as('auditLogsTableData');
    cy.intercept('GET', this.STATS_URL).as('auditLogsStats');
    cy.visitBackoffice(this.PAGE_URL);

    return cy.wait('@auditLogsTableData');
  };

  waitForStats = (): Cypress.Chainable => cy.wait('@auditLogsStats');

  aliasTableData = (alias: string): void => {
    cy.intercept('GET', this.TABLE_DATA_URL).as(alias);
  };

  getSectionTitle = (): Cypress.Chainable => cy.get(this.repository.getSectionTitleSelector());

  getStatsCards = (): Cypress.Chainable => cy.get(this.repository.getStatsCardsSelector());

  getStatsCardTitles = (): Cypress.Chainable => cy.get(this.repository.getStatsCardTitleSelector());

  getTable = (): Cypress.Chainable => cy.get(this.repository.getTableSelector());

  getTableWrapper = (): Cypress.Chainable => cy.get(this.repository.getTableWrapperSelector());

  getTableHeaders = (): Cypress.Chainable => cy.get(this.repository.getTableHeaderSelector());

  getColumnHeader = (column: string): Cypress.Chainable => cy.get(this.repository.getColumnHeaderSelector(column));

  getSortableColumnHeader = (column: string): Cypress.Chainable =>
    cy.get(this.repository.getSortableColumnHeaderSelector(column));

  getNonSortableColumnHeader = (column: string): Cypress.Chainable =>
    cy.get(this.repository.getNonSortableColumnHeaderSelector(column));

  getLengthSelect = (): Cypress.Chainable => cy.get(this.repository.getLengthSelectSelector());

  getTableInfo = (): Cypress.Chainable => cy.get(this.repository.getTableInfoSelector());

  selectPageLength = (value: string): Cypress.Chainable => this.getLengthSelect().select(value);

  /**
   * Positional column order of the raw `data` rows returned by the table endpoint. The endpoint
   * returns DataTables "array" mode (each row is `unknown[]`, not an object keyed by column name),
   * in the same left-to-right order as the rendered table headers.
   */
  private ROW_COLUMNS: Array<string> = [
    'spy_ai_interaction_log.prompt',
    'spy_ai_interaction_log.conversation_reference',
    'spy_ai_interaction_log.provider',
    'spy_ai_interaction_log.model',
    'total_tokens',
    'estimated_cost',
    'spy_ai_interaction_log.configuration_name',
    'spy_ai_interaction_log.is_successful',
    'spy_ai_interaction_log.inference_time_ms',
    'spy_ai_interaction_log.created_at',
  ];

  /**
   * Maps one positional `data` row to an object keyed by column name (see `ROW_COLUMNS`), so callers
   * can read fields by name instead of by fragile array index.
   */
  private mapRow = (row: Array<unknown>): Record<string, unknown> =>
    this.ROW_COLUMNS.reduce(
      (mapped, column, index) => {
        mapped[column] = row[index];

        return mapped;
      },
      {} as Record<string, unknown>
    );

  /**
   * Fetches the most-recent audit-log rows straight from the DataTable JSON endpoint, newest-first
   * (default sort is `created_at` DESC). It NEVER passes `search[value]`: that global search fans out
   * a LIKE across every header column — including the synthetic `total_tokens` / `estimated_cost`
   * columns that are not real DB columns — and 500s. A plain paged request returns HTTP 200.
   *
   * Returns both the `recordsTotal` (unfiltered count) and the `data` rows, remapped from the
   * endpoint's positional array shape into named-column objects (`spy_ai_interaction_log.provider`,
   * `spy_ai_interaction_log.created_at`, `total_tokens`, `estimated_cost`, ...). The caller identifies
   * its own row(s) by a baseline COUNT delta (see the spec): the top `recordsTotal - baselineTotal`
   * rows are exactly the ones created in this test's window, which stays decoupled from every other
   * test's rows regardless of added/removed sibling tests.
   */
  fetchRecentTableData = (
    length = 100
  ): Cypress.Chainable<{ recordsTotal: number; rows: Array<Record<string, unknown>> }> => {
    const url = `${Cypress.env().backofficeUrl}${this.repository.getTableDataPath()}`;

    return cy
      .request({
        method: 'GET',
        url,
        qs: {
          draw: '1',
          start: '0',
          length: String(length),
        },
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then((response) => {
        expect(response.status, 'audit-log table endpoint responds 200 (no search[value])').to.eq(200);

        const body = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
        const rawRows = (body.data ?? []) as Array<Array<unknown>>;

        return {
          recordsTotal: Number(body.recordsTotal ?? 0),
          rows: rawRows.map(this.mapRow),
        };
      });
  };

  /**
   * Reads a row's server-formatted `created_at` value (`Y-m-d H:i:s`, lexicographically sortable).
   * Returns an empty string when the row/column is missing.
   */
  getRowCreatedAt = (row: Record<string, unknown> | undefined): string =>
    String(row?.['spy_ai_interaction_log.created_at'] ?? '');

  /**
   * Reads a row's `configuration_name` (the AI configuration that produced the interaction, e.g. the
   * resolved OpenAI/AWS-Bedrock/Anthropic config). Returns an empty string when the row/column is missing.
   */
  getRowConfigurationName = (row: Record<string, unknown> | undefined): string =>
    String(row?.['spy_ai_interaction_log.configuration_name'] ?? '');

  /**
   * Fetches audit-log rows narrowed by the server-side `configuration_name` filter (the same filter the
   * BO filter-form exposes: `AiInteractionLogTable::applyFilters()` calls `filterByConfigurationName()`).
   * The filter value rides as a plain top-level `configuration_name` query param (the table serializes its
   * filter data via `http_build_query`), NOT via `search[value]` (which 500s — see `fetchRecentTableData`).
   *
   * Returns the filtered `recordsTotal` and the remapped rows. Callers assert the filter actually narrows
   * the set: every returned row's `configuration_name` equals the requested value, and the filtered count
   * is <= the unfiltered count.
   */
  fetchTableDataFilteredByConfiguration = (
    configurationName: string,
    length = 100
  ): Cypress.Chainable<{ recordsTotal: number; rows: Array<Record<string, unknown>> }> => {
    const url = `${Cypress.env().backofficeUrl}${this.repository.getTableDataPath()}`;

    return cy
      .request({
        method: 'GET',
        url,
        qs: {
          draw: '1',
          start: '0',
          length: String(length),
          configuration_name: configurationName,
        },
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then((response) => {
        expect(response.status, 'audit-log table endpoint responds 200 with configuration_name filter').to.eq(200);

        const body = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
        const rawRows = (body.data ?? []) as Array<Array<unknown>>;

        return {
          recordsTotal: Number(body.recordsTotal ?? 0),
          rows: rawRows.map(this.mapRow),
        };
      });
  };
}
