import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductManagementEditRepository {
  getApproveButton = (): Cypress.Chainable => cy.get('a:contains("Approve")');
  getVariantsTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-variants"]');
  getVariantFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getVariantEditButtonSelector = (): string => 'a:contains("Edit")';
  getGeneralTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-general"]');
  getPriceTaxTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-price_and_tax"]');
  getAllStockInputs = (): Cypress.Chainable => cy.get('input[name="product_form_edit[store_relation][id_stores][]"]');
  getAllPriceInputs = (): Cypress.Chainable => cy.get('#price-table-collection [data-decimal-rounding="2"]');
  getSaveButton = (): Cypress.Chainable => cy.get('[name="product_form_edit"] [value="Save"]');
  getProductNameDEInput = (): Cypress.Chainable => cy.get('#product_form_edit_general_de_DE_name');
}
