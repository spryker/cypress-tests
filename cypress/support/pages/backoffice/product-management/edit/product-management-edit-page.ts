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
    this.repository.getProductNameDEInput().type(this.faker.commerce.productName());
  };

  save = (): void => {
    this.repository.getSaveButton().click();
  };

  openMediaTab = (): void => {
    this.repository.getMediaTab().click({ force: true });
  };

  addAttachment = (params: AddAttachmentParams): void => {
    const locale = params.locale ?? 'default';

    this.repository.getAddAttachmentButton(locale).click();

    this.repository.getAttachmentItems(locale).then(($items) => {
      const index = params.index ?? $items.length - 1;

      this.repository.getAttachmentLabelInput(index, locale).type(params.label);
      this.repository.getAttachmentUrlInput(index, locale).type(params.url);

      if (params.sortOrder !== undefined) {
        this.repository.getAttachmentSortOrderInput(index, locale).clear().type(params.sortOrder.toString());
      }
    });
  };

  getLocalizedIboxToggle = (): Cypress.Chainable => {
    return this.repository.getLocalizedIboxToggle();
  };

  expandLocaleSection = (locale: string): void => {
    this.repository.expandLocaleSection(locale);
  };

  verifyAttachmentExists = (params: VerifyAttachmentParams): void => {
    const index = params.index ?? 0;
    const locale = params.locale ?? 'default';

    this.repository.getAttachmentLabelInput(index, locale).should('have.value', params.label);
    this.repository.getAttachmentUrlInput(index, locale).should('have.value', params.url);
  };
}

interface AddAttachmentParams {
  label: string;
  url: string;
  sortOrder?: number;
  index?: number;
  locale?: string;
}

interface VerifyAttachmentParams {
  label: string;
  url: string;
  index?: number;
  locale?: string;
}
