import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { AuditLogsRepository } from './audit-logs-repository';

@injectable()
@autoWired
export class AuditLogsPage extends BackofficePage {
  @inject(REPOSITORIES.AuditLogsRepository) private repository: AuditLogsRepository;

  protected PAGE_URL = '/ai-foundation/ai-interaction-log';

  visitAuditLogs = (): Cypress.Chainable => {
    cy.intercept('GET', '**/ai-foundation/ai-interaction-log').as('auditLogsDocument');
    cy.visitBackoffice(this.PAGE_URL);

    return cy.wait('@auditLogsDocument');
  };

  getSectionTitle = (): Cypress.Chainable => cy.get(this.repository.getSectionTitleSelector());

  getStatsCards = (): Cypress.Chainable => cy.get(this.repository.getStatsCardsSelector());

  getStatsCardTitles = (): Cypress.Chainable => cy.get(this.repository.getStatsCardTitleSelector());

  getTable = (): Cypress.Chainable => cy.get(this.repository.getTableSelector());

  getTableHeaders = (): Cypress.Chainable => cy.get(this.repository.getTableHeaderSelector());

  getColumnHeader = (column: string): Cypress.Chainable => cy.get(this.repository.getColumnHeaderSelector(column));
}
