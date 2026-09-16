import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { AiWorkflowsRepository } from './ai-workflows-repository';

@injectable()
@autoWired
export class AiWorkflowsPage extends BackofficePage {
  @inject(AiWorkflowsRepository) private repository: AiWorkflowsRepository;

  protected PAGE_URL = '/ai-foundation/ai-workflow';

  private TABLE_DATA_URL = '**/ai-foundation/ai-workflow/table**';

  visitAiWorkflows = (): Cypress.Chainable => {
    cy.intercept('GET', '**/ai-foundation/ai-workflow').as('aiWorkflowsDocument');
    cy.visitBackoffice(this.PAGE_URL);

    return cy.wait('@aiWorkflowsDocument');
  };

  visitAndAwaitTableData = (): Cypress.Chainable => {
    cy.intercept('GET', this.TABLE_DATA_URL).as('aiWorkflowsTableData');
    cy.visitBackoffice(this.PAGE_URL);

    return cy.wait('@aiWorkflowsTableData');
  };

  aliasTableData = (alias: string): void => {
    cy.intercept('GET', this.TABLE_DATA_URL).as(alias);
  };

  getSectionTitle = (): Cypress.Chainable => cy.get(this.repository.getSectionTitleSelector());

  getSectionTitleText = (): string => this.repository.getSectionTitleText();

  getWidgetTitle = (): Cypress.Chainable => cy.get(this.repository.getWidgetTitleSelector());

  getWidgetTitleText = (): string => this.repository.getWidgetTitleText();

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
