import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ContentUsageRepository {
  getHeader = (): Cypress.Chainable => cy.get('[data-qa="usage-header"]');

  getSourceRows = (): Cypress.Chainable => cy.get('[data-qa="usage-sources"] tbody tr');
}
