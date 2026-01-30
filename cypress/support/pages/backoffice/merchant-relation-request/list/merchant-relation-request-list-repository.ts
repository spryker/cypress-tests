import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantRelationRequestListRepository {
  getFilterMerchantSelect = (): Cypress.Chainable => cy.get('#idMerchant');
  getFilterCompanySelect = (): Cypress.Chainable => cy.get('#idCompany');
  getEditButtons = (): Cypress.Chainable => cy.get('.btn-edit', { timeout: 10000 });
  getViewButtons = (): Cypress.Chainable => cy.get('.btn-view', { timeout: 10000 });
}
