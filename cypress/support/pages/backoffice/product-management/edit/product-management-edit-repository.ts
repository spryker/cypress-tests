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
  getCollapsedBlock = (): Cypress.Chainable =>
    cy.get('#tab-content-general > .panel-body > .collapsed > .ibox-title > .collapse-link > .ibox-tools > .fas');
  getMediaTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-image"]');

  getAddAttachmentButton = (locale = 'default'): Cypress.Chainable =>
    this.getAttachmentLocaleContainer(locale).find('.add-another-attachment');

  getAttachmentItems = (locale = 'default'): Cypress.Chainable =>
    this.getAttachmentLocaleContainer(locale).find('.attachment-container > div.m-b-md');

  getAttachmentLabelInput = (index: number, locale = 'default'): Cypress.Chainable =>
    this.getAttachmentLocaleContainer(locale).find(
      `input[name="product_form_edit[attachment_${locale}][${index}][label]"]`
    );

  getAttachmentUrlInput = (index: number, locale = 'default'): Cypress.Chainable =>
    this.getAttachmentLocaleContainer(locale).find(
      `input[name="product_form_edit[attachment_${locale}][${index}][url]"]`
    );

  getAttachmentSortOrderInput = (index: number, locale = 'default'): Cypress.Chainable =>
    this.getAttachmentLocaleContainer(locale).find(
      `input[name="product_form_edit[attachment_${locale}][${index}][sort_order]"]`
    );

  getLocalizedIboxToggle = (): Cypress.Chainable => cy.get('.ibox.nested.collapsed .ibox-title');

  getLocaleExpandButton = (locale: string): Cypress.Chainable =>
    cy
      .get('.attachment-forms')
      .contains('.ibox-title', this.getLocaleDisplayName(locale))
      .closest('.ibox.nested.collapsed')
      .find('.ibox-title .collapse-link');

  getAttachmentDeleteButtonByIndex = (index: number, locale = 'default'): Cypress.Chainable =>
    this.getAttachmentItems(locale).eq(index).find('.remove-attachment');

  getAttachmentDeleteButtonForLocale = (locale: string): Cypress.Chainable =>
    this.getAttachmentLocaleContainer(locale).find('.attachment-container > div.m-b-md .remove-attachment');

  getSaveSuccessMessage = (sku: string): Cypress.Chainable =>
    cy.contains(`The product [${sku}] was saved successfully`);

  private getAttachmentLocaleContainer = (locale: string): Cypress.Chainable =>
    cy.get('.attachment-forms').contains('.ibox-title', this.getLocaleDisplayName(locale)).closest('.ibox');

  private getLocaleDisplayName = (locale: string): string => {
    const localeMap: Record<string, string> = {
      default: 'Default',
    };
    return localeMap[locale] || locale;
  };
}
