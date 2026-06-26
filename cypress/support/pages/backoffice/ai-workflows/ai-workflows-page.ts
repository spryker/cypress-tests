import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { AiWorkflowsRepository } from './ai-workflows-repository';

@injectable()
@autoWired
export class AiWorkflowsPage extends BackofficePage {
  @inject(REPOSITORIES.AiWorkflowsRepository) private repository: AiWorkflowsRepository;

  protected PAGE_URL = '/ai-foundation/ai-workflow';

  visitAiWorkflows = (): Cypress.Chainable => {
    cy.intercept('GET', '**/ai-foundation/ai-workflow').as('aiWorkflowsDocument');
    cy.visitBackoffice(this.PAGE_URL);

    return cy.wait('@aiWorkflowsDocument');
  };

  getSectionTitle = (): Cypress.Chainable => cy.get(this.repository.getSectionTitleSelector());

  getWidgetTitle = (): Cypress.Chainable => cy.get(this.repository.getWidgetTitleSelector());

  getTable = (): Cypress.Chainable => cy.get(this.repository.getTableSelector());

  getTableHeaders = (): Cypress.Chainable => cy.get(this.repository.getTableHeaderSelector());

  getColumnHeader = (column: string): Cypress.Chainable => cy.get(this.repository.getColumnHeaderSelector(column));
}
