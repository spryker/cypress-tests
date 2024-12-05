import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantUpdateRepository {
  getUsersTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-merchant-user"]');
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '.dataTables_filter input[type="search"]';
  getAddMerchantUserButton = (): Cypress.Chainable => cy.get('body').find('a:contains("Add Merchant User")');
  getAllAvailableStoresInputs = (): Cypress.Chainable => cy.get('input[name="merchant[storeRelation][id_stores][]"]');
  getSaveButton = (): Cypress.Chainable => cy.get('input[type="submit"]');
}
