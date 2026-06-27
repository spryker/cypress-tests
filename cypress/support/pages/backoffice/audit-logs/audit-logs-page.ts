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
}
