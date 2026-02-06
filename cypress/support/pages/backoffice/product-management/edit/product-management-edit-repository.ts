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
  getMediaTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-image"]');
  getAddAttachmentButton = (): Cypress.Chainable => cy.get('.add-another-attachment');
  getAttachmentItems = (): Cypress.Chainable => cy.get('.attachment-item');
  getAttachmentLabelInput = (index: number): Cypress.Chainable =>
    cy.get(`input[name="product_form_edit[attachment][${index}][label]"]`);
  getAttachmentUrlInput = (index: number): Cypress.Chainable =>
    cy.get(`input[name="product_form_edit[attachment][${index}][url]"]`);
  getAttachmentSortOrderInput = (index: number): Cypress.Chainable =>
    cy.get(`input[name="product_form_edit[attachment][${index}][sort_order]"]`);
  getAttachmentLocalizedLabelInput = (attachmentIndex: number, localeIndex: number): Cypress.Chainable =>
    cy.get(
      `input[name="product_form_edit[attachment][${attachmentIndex}][localized_attributes][${localeIndex}][label]"]`
    );
  getAttachmentLocalizedUrlInput = (attachmentIndex: number, localeIndex: number): Cypress.Chainable =>
    cy.get(
      `input[name="product_form_edit[attachment][${attachmentIndex}][localized_attributes][${localeIndex}][url]"]`
    );
  getLocalizedIboxToggle = (): Cypress.Chainable => cy.get('.attachment-item .ibox.nested.collapsed .ibox-title');
  getRemoveAttachmentButton = (index: number): Cypress.Chainable =>
    cy.get('.attachment-item').eq(index).find('.remove-attachment');
}
