import { autoWired } from '@utils';
import { injectable } from 'inversify';

const PRODUCT_SAVE_TIMEOUT = 30000;

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
  getConfiguratorSetupStatus = (): Cypress.Chainable => cy.get('[data-qa="configurator-setup-status"]');
  getConfigurationTemplateDownloadLink = (configuratorKey: string): Cypress.Chainable =>
    cy.get(`[data-qa="configurator-setup-download-template"][data-configurator-key="${configuratorKey}"]`);
  getSavedConfigurationDownloadLink = (): Cypress.Chainable => cy.get('[data-qa="configurator-setup-download"]');
  getSavedConfigurationDownloadUnavailableButton = (): Cypress.Chainable =>
    cy.get('[data-qa="configurator-setup-download-unavailable"]');
  getConfigurationFileInput = (): Cypress.Chainable => cy.get('[data-qa="configurator-setup-file"]');
  getConfigurationFileDropArea = (): Cypress.Chainable =>
    cy.get('[data-qa="configurator-setup-upload"] [data-qa="input-dropzone-area"]');
  getConfigurationFileList = (): Cypress.Chainable =>
    cy.get('[data-qa="configurator-setup-upload"] [data-qa="input-dropzone-files"]');
  getConfigurationFileMessage = (): Cypress.Chainable =>
    cy.get('[data-qa="configurator-setup-upload"] [data-qa="input-dropzone-message"]');
  getConfiguratorSetupErrors = (): Cypress.Chainable => cy.get('[data-qa="configurator-setup-errors"]');
  getConfiguratorSetupNotSavedBadge = (): Cypress.Chainable => cy.get('[data-qa="configurator-setup-not-saved"]');
  getConfiguratorSetupEmptySummary = (): Cypress.Chainable => cy.get('[data-qa="configurator-setup-summary-empty"]');
  getConfiguratorSetupConfiguratorKey = (): Cypress.Chainable =>
    cy.get('[data-qa="configurator-setup-configurator-key"]');
  getConfiguratorSetupSummaryItems = (): Cypress.Chainable => cy.get('[data-qa="configurator-setup-summary-item"]');
  getConfiguratorSetupLastChange = (): Cypress.Chainable => cy.get('[data-qa="configurator-setup-last-change"]');
  getConfigurableProductSummaryGroupsToggle = (): Cypress.Chainable =>
    cy.get('[data-qa="configurable-product-summary-groups-toggle"]');
  getConfigurableProductSummaryRulesToggle = (): Cypress.Chainable =>
    cy.get('[data-qa="configurable-product-summary-rules-toggle"]');
  getConfigurableProductSummaryGroupLabels = (): Cypress.Chainable =>
    cy.get('[data-qa="configurable-product-summary-group-label"]');
  getConfigurableProductSummaryRuleTexts = (): Cypress.Chainable =>
    cy.get('[data-qa="configurable-product-summary-rule-text"]');
  getFlashMessage = (message: string): Cypress.Chainable => cy.contains(message, { timeout: PRODUCT_SAVE_TIMEOUT });
}
