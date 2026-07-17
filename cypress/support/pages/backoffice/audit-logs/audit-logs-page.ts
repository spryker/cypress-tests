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

  getSectionTitleText = (): string => this.repository.getSectionTitleText();

  getTotalInteractionsCardText = (): string => this.repository.getTotalInteractionsCardText();

  getSuccessStatusText = (): string => this.repository.getSuccessStatusText();

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

  private mapRow = (row: Array<unknown>): Record<string, unknown> =>
    this.ROW_COLUMNS.reduce(
      (mapped, column, index) => {
        mapped[column] = row[index];

        return mapped;
      },
      {} as Record<string, unknown>
    );

  fetchTableData = ({
    length = 100,
    configurationName,
  }: { length?: number; configurationName?: string } = {}): Cypress.Chainable<{
    recordsTotal: number;
    rows: Array<Record<string, unknown>>;
  }> => {
    const url = this.getBackofficeAbsoluteUrl(this.repository.getTableDataPath());
    const qs: Record<string, string> = { draw: '1', start: '0', length: String(length) };
    if (configurationName) {
      qs.configuration_name = configurationName;
    }

    return cy
      .request({ method: 'GET', url, qs, headers: { 'X-Requested-With': 'XMLHttpRequest' } })
      .then((response) => {
        expect(response.status, 'audit-log table endpoint responds 200').to.eq(200);

        const body = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
        const rawRows = (body.data ?? []) as Array<Array<unknown>>;

        return {
          recordsTotal: Number(body.recordsTotal ?? 0),
          rows: rawRows.map(this.mapRow),
        };
      });
  };

  getRowCreatedAt = (row: Record<string, unknown> | undefined): string =>
    String(row?.['spy_ai_interaction_log.created_at'] ?? '');

  getRowConfigurationName = (row: Record<string, unknown> | undefined): string =>
    String(row?.['spy_ai_interaction_log.configuration_name'] ?? '');

  assertNewestRowConfigurationIsFilterable = (configurationMarker: string): void => {
    this.fetchTableData().then(({ recordsTotal, rows }) => {
      expect(recordsTotal, 'at least one audit-log row exists after the real interaction').to.be.greaterThan(0);

      const newestConfiguration = this.getRowConfigurationName(rows[0]);
      expect(newestConfiguration, `newest audit-log row is a ${configurationMarker} configuration`).to.contain(
        configurationMarker
      );

      this.fetchTableData({ configurationName: newestConfiguration }).then((filtered) => {
        expect(filtered.rows.length, 'the configuration filter returns rows').to.be.greaterThan(0);
        filtered.rows.forEach((row) => {
          expect(this.getRowConfigurationName(row), 'every filtered row matches the configuration').to.eq(
            newestConfiguration
          );
        });
        expect(filtered.recordsTotal, 'filtered count is <= unfiltered count').to.be.at.most(recordsTotal);
      });
    });
  };
}
