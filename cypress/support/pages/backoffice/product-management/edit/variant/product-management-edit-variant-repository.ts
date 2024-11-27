import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductManagementEditVariantRepository {
  getActivateButton = (): Cypress.Chainable => cy.get('a:contains("Activate")');
  getDeactivateButton = (): Cypress.Chainable => cy.get('a:contains("Deactivate")');
  getSearchableDECheckbox = (): Cypress.Chainable => cy.get('#product_concrete_form_edit_general_de_DE_is_searchable');
  getEnUsCollapsedBlock = (): Cypress.Chainable =>
    cy.get('#tab-content-general > .panel-body > .collapsed > .ibox-title > .collapse-link > .ibox-tools > .fas');
  getSearchableENCheckbox = (): Cypress.Chainable => cy.get('#product_concrete_form_edit_general_en_US_is_searchable');
  getPriceStockTab = (): Cypress.Chainable => cy.get('[data-bs-target="#tab-content-price"]');
  getIsNeverOutOfStockCheckbox = (): Cypress.Chainable =>
    cy.get('#product_concrete_form_edit_price_and_stock_1_is_never_out_of_stock');
  getSaveButton = (): Cypress.Chainable => cy.get('[type="submit"]');
}
