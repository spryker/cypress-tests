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
    this.repository.getVariantsTab().click();
    this.repository.getVariantFirstTableRow().then(($productVariantRow) => {
      cy.wrap($productVariantRow).find(this.repository.getVariantEditButtonSelector()).as('editVariantButton');
      cy.get('@editVariantButton').should('be.visible').click({ force: true });
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

  verifyAttachmentExists = (params: AttachmentParams): void => {
    const index = params.index ?? 0;

    this.repository.getAttachmentLabelInput(index, params.locale).should('have.value', params.label);
    this.repository.getAttachmentUrlInput(index, params.locale).should('have.value', params.url);
  };

  verifySaveSuccess = (sku: string): void => {
    this.repository.getSaveSuccessMessage(sku).should('be.visible');
  };

  deleteAttachmentByIndex = (locale: string, index: number): void => {
    this.repository.getAttachmentDeleteButtonByIndex(index, locale).click();
  };

  verifyAttachmentCount = (locale: string, count: number): void => {
    this.repository.getAttachmentItems(locale).should('have.length', count);
  };

  deleteAttachmentsForLocale = (locale: string): void => {
    this.repository.getAttachmentDeleteButtonForLocale(locale).each(($el) => {
      cy.wrap($el).click();
    });
  };
}

interface AttachmentParams {
  label: string;
  url: string;
  sortOrder?: number;
  index?: number;
  locale: string;
}
