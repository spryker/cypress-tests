import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantUpdateRepository {
  getNameInput = (): Cypress.Chainable => cy.get('#merchant_name');
  getUsersTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-merchant-user"]');
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '.dt-search input[type="search"]';
  getAddMerchantUserButton = (): Cypress.Chainable => cy.get('body').find('a:contains("Add Merchant User")');

  getMerchantUserTableRows = (): Cypress.Chainable =>
    cy.get('#tab-content-merchant-user table tbody tr', { timeout: 20000 });

  getMerchantUserEditButtonSelector = (): string => 'a[href*="/merchant-user-gui/edit-merchant-user"]';

  getMerchantUserActivateButtonSelector = (): string => 'a[href*="status=active"]';

  // Deactivating a merchant user sets it to the blocked status; the table then labels it Deactivated.
  getMerchantUserDeactivateButtonSelector = (): string => 'a[href*="status=blocked"]';

  getMerchantUserDeleteButtonSelector = (): string => '[data-qa="delete-button"]';

  getConfirmDeleteButton = (): Cypress.Chainable => cy.get('form [type="submit"]');
  getAllAvailableStoresInputs = (): Cypress.Chainable => cy.get('input[name="merchant[storeRelation][id_stores][]"]');
  getSaveButton = (): Cypress.Chainable => cy.get('input[type="submit"]');
}
