import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductManagementEditVariantRepository {
  getActivateButton = (): Cypress.Chainable => cy.get('a:contains("Activate")');
  getDeactivateButton = (): Cypress.Chainable => cy.get('a:contains("Deactivate")');
  getSearchableDECheckbox = (): Cypress.Chainable => cy.get('#product_concrete_form_edit_general_de_DE_is_searchable');
  getCollapsedBlock = (): Cypress.Chainable =>
    cy.get('#tab-content-general > .panel-body > .collapsed > .ibox-title > .collapse-link > .ibox-tools > .fas');
  getSearchableENCheckbox = (): Cypress.Chainable => cy.get('#product_concrete_form_edit_general_en_US_is_searchable');
  getPriceStockTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-price"]');
  getIsNeverOutOfStockCheckbox = (): Cypress.Chainable =>
    cy.get('#product_concrete_form_edit_price_and_stock_0_is_never_out_of_stock');
  getSaveButton = (): Cypress.Chainable => cy.get('[type="submit"]');
  getPriceTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-price"]');
  getAllPriceInputs = (): Cypress.Chainable => cy.get('#price-table-collection [data-decimal-rounding="2"]');
  getProductNameInput = (localeName: string): Cypress.Chainable =>
    cy.get(`input[name="product_concrete_form_edit[general_${localeName}][name]"]`);
  getConfiguratorSetupTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-configurator-setup"]');
  getConfigurationTemplateDownloadLink = (configuratorKey: string): Cypress.Chainable =>
    cy.get(`[data-qa="configurator-setup-download-template"][data-configurator-key="${configuratorKey}"]`);
  getConfigurationFileInput = (): Cypress.Chainable => cy.get('[data-qa="configurator-setup-file"]');
  getConfiguratorSetupErrors = (): Cypress.Chainable => cy.get('[data-qa="configurator-setup-errors"]');
  getConfiguratorSetupNotSavedBadge = (): Cypress.Chainable => cy.get('[data-qa="configurator-setup-not-saved"]');
  getConfiguratorSetupConfiguratorKey = (): Cypress.Chainable =>
    cy.get('[data-qa="configurator-setup-configurator-key"]');
  // Saving a product runs its after-update plugins and publish triggers synchronously, so the flash needs a wider window.
  getFlashMessage = (message: string): Cypress.Chainable => cy.contains(message, { timeout: 30000 });
}
