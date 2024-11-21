import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductManagementAddRepository {
  getSkuPrefixInput = (): Cypress.Chainable => cy.get('#product_form_add_sku');
  getProductNameDEInput = (): Cypress.Chainable => cy.get('#product_form_add_general_de_DE_name');
  getEnUsCollapsedBlock = (): Cypress.Chainable =>
    cy.get('#tab-content-general > .panel-body > .collapsed > .ibox-title > .collapse-link > .ibox-tools > .fas');
  getProductDescriptionDEInput = (): Cypress.Chainable => cy.get('#product_form_add_general_de_DE_description');
  getProductNameENInput = (): Cypress.Chainable => cy.get('#product_form_add_general_en_US_name');
  getProductDescriptionENInput = (): Cypress.Chainable => cy.get('#product_form_add_general_en_US_description');
  getNewFromInput = (): Cypress.Chainable => cy.get('#product_form_add_new_from');
  getNewToInput = (): Cypress.Chainable => cy.get('#product_form_add_new_to');
  getPriceTaxTab = (): Cypress.Chainable => cy.get('[data-bs-target="tab-content-price_and_tax"]');
  getDefaultGrossPriceInput = (): Cypress.Chainable =>
    cy.get('#product_form_add_prices_1-93-DEFAULT-BOTH_moneyValue_gross_amount');
  getOriginalGrossPriceInput = (): Cypress.Chainable =>
    cy.get('#product_form_add_prices_1-93-ORIGINAL-BOTH_moneyValue_gross_amount');
  getDefaultNetPriceInput = (): Cypress.Chainable =>
    cy.get('#product_form_add_prices_1-93-DEFAULT-BOTH_moneyValue_net_amount');
  getOriginalNetPriceInput = (): Cypress.Chainable =>
    cy.get('#product_form_add_prices_1-93-ORIGINAL-BOTH_moneyValue_net_amount');
  getTaxSelect = (): Cypress.Chainable => cy.get('#product_form_add_tax_rate');
  getVariantsTab = (): Cypress.Chainable => cy.get('[data-bs-target="tab-content-variants"]');
  getVariantStorageCapacityCheckbox = (): Cypress.Chainable =>
    cy.get('#product_form_add_attribute_super_storage_capacity_name');
  getVariantStorageCapacitySelect = (): Cypress.Chainable =>
    cy.get('#product_form_add_attribute_super_storage_capacity_value');
  getImageTab = (): Cypress.Chainable => cy.get('[data-bs-target="tab-content-image"]');
  getAddImageSetButton = (): Cypress.Chainable => cy.get('a:contains("Add image set")');
  getImageSetName = (): Cypress.Chainable => cy.get('#product_form_add_image_set_default_0_name');
  getSmallImageUrlInput = (): Cypress.Chainable =>
    cy.get('#product_form_add_image_set_default_0_product_images_0_external_url_small');
  getLargeImageUrlInput = (): Cypress.Chainable =>
    cy.get('#product_form_add_image_set_default_0_product_images_0_external_url_large');
  getSaveButton = (): Cypress.Chainable => cy.get('[type="submit"]');
  getVariantSuperSizeCheckbox = (): Cypress.Chainable => cy.get('#product_form_add_attribute_super_size_name');
  getVariantSuperSizeSelect = (): Cypress.Chainable => cy.get('#product_form_add_attribute_super_size_value');
}
