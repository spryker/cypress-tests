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
    cy.get('body').then(($body) => {
      const initialCount = $body.find('.attachment-item').length;

      this.repository.getAddAttachmentButton().click();

      const index = initialCount;

      this.repository.getAttachmentLabelInput(index).type(params.label);
      this.repository.getAttachmentUrlInput(index).type(params.url);

      if (params.sortOrder !== undefined) {
        this.repository.getAttachmentSortOrderInput(index).clear().type(params.sortOrder.toString());
      }
    });
  };

  addAttachmentWithLocale = (params: AddAttachmentWithLocaleParams): void => {
    cy.get('body').then(($body) => {
      const initialCount = $body.find('.attachment-item').length;

      this.repository.getAddAttachmentButton().click();

      const index = initialCount;

      this.repository.getAttachmentLabelInput(index).type(params.label);
      this.repository.getAttachmentUrlInput(index).type(params.url);

      if (params.sortOrder !== undefined) {
        this.repository.getAttachmentSortOrderInput(index).clear().type(params.sortOrder.toString());
      }

      this.repository
        .getAttachmentItems()
        .eq(index)
        .find('.ibox.nested.collapsed .ibox-title')
        .first()
        .click({ force: true });

      const localeIndex = params.localeIndex ?? 0;

      this.repository.getAttachmentLocalizedLabelInput(index, localeIndex).type(params.localizedLabel, {
        force: true,
      });
      this.repository.getAttachmentLocalizedUrlInput(index, localeIndex).type(params.localizedUrl, {
        force: true,
      });
    });
  };

  getAttachmentItems = (): Cypress.Chainable => {
    return this.repository.getAttachmentItems();
  };

  getAddAttachmentButton = (): Cypress.Chainable => {
    return this.repository.getAddAttachmentButton();
  };

  getLocalizedIboxToggle = (): Cypress.Chainable => {
    return this.repository.getLocalizedIboxToggle();
  };

  getAttachmentLocalizedLabelInput = (attachmentIndex: number, localeIndex: number): Cypress.Chainable => {
    return this.repository.getAttachmentLocalizedLabelInput(attachmentIndex, localeIndex);
  };

  getAttachmentLocalizedUrlInput = (attachmentIndex: number, localeIndex: number): Cypress.Chainable => {
    return this.repository.getAttachmentLocalizedUrlInput(attachmentIndex, localeIndex);
  };

  verifyAttachmentExists = (params: VerifyAttachmentParams): void => {
    const index = params.index ?? 0;

    this.repository.getAttachmentLabelInput(index).should('have.value', params.label);
    this.repository.getAttachmentUrlInput(index).should('have.value', params.url);
  };
}

interface AddAttachmentParams {
  label: string;
  url: string;
  sortOrder?: number;
  index?: number;
}

interface AddAttachmentWithLocaleParams {
  label: string;
  url: string;
  localizedLabel: string;
  localizedUrl: string;
  sortOrder?: number;
  index?: number;
  localeIndex?: number;
}

interface VerifyAttachmentParams {
  label: string;
  url: string;
  index?: number;
}
