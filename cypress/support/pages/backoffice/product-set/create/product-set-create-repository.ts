import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductSetCreateRepository {
  getGeneralBlock = (): Cypress.Chainable => cy.get('#tab-content-general');
  getCollapseLinkSelector = (): string => '.collapse-link';
  getIboxContentSelector = (): string => '.ibox-content';
  getLocalizedBlockSelector = (): string => '.ibox.nested';
  // The two hidden siblings in the same block are the url prefix and the original url, so the
  // visible text input is what distinguishes the field the form actually reads.
  getLocalizedNameSelector = (): string => 'input[type="text"][id$="_name"]';
  getLocalizedUrlSelector = (): string => 'input[type="text"][id$="_url"]';
  getProductSetKeyInput = (): Cypress.Chainable => cy.get('#product_set_form_general_form_product_set_key');
  getIsActiveCheckbox = (): Cypress.Chainable => cy.get('#product_set_form_general_form_is_active');
  getProductsTab = (): Cypress.Chainable => cy.get('[data-qa="tab-products"]');
  getProductSearchInput = (): Cypress.Chainable => cy.get('input[aria-controls="product-table"]');
  getProductTableInfo = (): Cypress.Chainable => cy.get('#product-table_info');
  getProductTableProcessing = (): Cypress.Chainable => cy.get('#product-table_processing');
  getProductRows = (): Cypress.Chainable => cy.get('#product-table tbody tr');
  getProductRowCheckboxes = (): Cypress.Chainable => cy.get('#product-table tbody input.all-products-checkbox');
  getAssignedProductsField = (): Cypress.Chainable =>
    cy.get('#product_set_form_products_form_assign_id_product_abstracts');
  getSaveButton = (): Cypress.Chainable => cy.get('form[name="product_set_form"] input[type="submit"]');
}
