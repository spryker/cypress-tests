import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantRelationRequestGuiListRepository {
  getFilterMerchantSelect = (): Cypress.Chainable => cy.get('#idMerchant');
  getFilterCompanySelect = (): Cypress.Chainable => cy.get('#idCompany');
  getEditButtons = (): Cypress.Chainable => cy.get('.btn-edit');
  getViewButtons = (): Cypress.Chainable => cy.get('.btn-view');
}
