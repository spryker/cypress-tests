import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantRelationshipListRepository {
  getFilterCompanySelect = (): Cypress.Chainable => cy.get('#company-select');
  getFilterSearchInput = (): Cypress.Chainable => cy.get('#merchant-relationship-table_filter [type="search"]');
  getEditButtons = (): Cypress.Chainable => cy.get('.btn-edit', { timeout: 10000 });
}
