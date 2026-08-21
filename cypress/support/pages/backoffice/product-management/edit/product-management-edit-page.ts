import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ProductManagementEditRepository } from './product-management-edit-repository';

@injectable()
@autoWired
export class ProductManagementEditPage extends BackofficePage {
  @inject(ProductManagementEditRepository) private repository: ProductManagementEditRepository;

  protected PAGE_URL = '/product-management/edit';

  approve = (): void => {
    if (!this.isRepository('b2c', 'b2b')) {
      this.repository.getApproveButton().click();
    }
  };

  openFirstVariant = (): void => {
    const variantTableUrl = '**/product-management/edit/variant-table**';
    cy.intercept('GET', variantTableUrl).as('variantTable');
    this.repository.getVariantsTab().click();
    cy.wait('@variantTable', { timeout: 1000 });
    this.repository.getVariantFirstTableRow().then(($productVariantRow) => {
      cy.wrap($productVariantRow).find(this.repository.getVariantEditButtonSelector()).as('editVariantButton');
      cy.get('@editVariantButton').click({ force: true });
    });
  };

  assignAllPossibleStores = (): void => {
    this.repository.getGeneralTab().click({ force: true });
    this.repository.getAllStockInputs().check();
  };

  getGeneralTab(): Cypress.Chainable {
    return this.repository.getGeneralTab();
  }

  bulkPriceUpdate = (productPrice: string): void => {
    this.repository.getPriceTaxTab().click();
    this.repository.getAllPriceInputs().each(($el) => {
      cy.wrap($el).type(productPrice, { force: true, delay: 0 });
    });
  };

  setDummyDEName = (): void => {
    this.repository.getCollapsedBlock().click();
    this.repository.getProductNameDEInput().type(this.faker.commerce.productName());
  };

  save = (): void => {
    this.repository.getSaveButton().click();
  };

  openMediaTab = (): void => {
    this.repository.getMediaTab().click({ force: true });
  };

  addAttachment = ({ locale, label, url, sortOrder, index }: AttachmentParams): void => {
    this.repository.getAddAttachmentButton(locale).click();

    this.repository.getAttachmentItems(locale).then(($items) => {
      const idx = index ?? $items.length - 1;

      this.repository.getAttachmentLabelInput(idx, locale).type(label);
      this.repository.getAttachmentUrlInput(idx, locale).type(url);

      if (sortOrder !== undefined) {
        this.repository.getAttachmentSortOrderInput(idx, locale).clear().type(sortOrder.toString());
      }
    });
  };

  getLocalizedIboxToggle = (): Cypress.Chainable => {
    return this.repository.getLocalizedIboxToggle();
  };

  expandLocaleSection = (locale: string): void => {
    this.repository.getLocaleExpandButton(locale).click({ force: true });
  };

  getAttachmentLabelInput = (index: number, locale: string): Cypress.Chainable =>
    this.repository.getAttachmentLabelInput(index, locale);

  getAttachmentUrlInput = (index: number, locale: string): Cypress.Chainable =>
    this.repository.getAttachmentUrlInput(index, locale);

  getSaveSuccessMessage = (sku: string): Cypress.Chainable => this.repository.getSaveSuccessMessage(sku);

  getAttachmentItems = (locale: string): Cypress.Chainable => this.repository.getAttachmentItems(locale);

  deleteAttachmentByIndex = (locale: string, index: number): void => {
    this.repository.getAttachmentDeleteButtonByIndex(index, locale).click();
  };

  deleteAttachmentsForLocale = (locale: string): void => {
    this.repository.getAttachmentDeleteButtonForLocale(locale).each(($el) => {
      cy.wrap($el).click();
    });
  };

  selectMerchant = (merchantName: string): void => {
    this.repository.getMerchantSelectContainer().click();
    this.repository.getMerchantSelectDropdownOptions().contains(merchantName).click();
  };

  removeMerchantAssignment = (): void => {
    this.repository.getMerchantSelectContainer().click();
    this.repository.getMerchantSelectDropdownOptions().contains('Not assigned').click();
  };

  getMerchantSelectContainer = (): Cypress.Chainable => this.repository.getMerchantSelectContainer();

  getMerchantNotAssignedOptionText = (): string => 'Not assigned';

  getAttachmentsSectionHeading = (): Cypress.Chainable => this.repository.getAttachmentsSectionHeading();

  getAttachmentsSectionDescription = (): Cypress.Chainable => this.repository.getAttachmentsSectionDescription();

  getFirstAttachmentFormLocaleTitle = (): Cypress.Chainable => this.repository.getFirstAttachmentFormLocaleTitle();

  getFirstAttachmentFormIbox = (): Cypress.Chainable => this.repository.getFirstAttachmentFormIbox();

  getFirstAttachmentFormAddButton = (): Cypress.Chainable => this.repository.getFirstAttachmentFormAddButton();
}

interface AttachmentParams {
  label: string;
  url: string;
  sortOrder?: number;
  index?: number;
  locale: string;
}
