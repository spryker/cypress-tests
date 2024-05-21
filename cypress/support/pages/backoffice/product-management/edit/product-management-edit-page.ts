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
      cy.get('@editVariantButton').click();
    });
  };

  checkAllStores = (): void => {
    this.repository.getGeneralTab().click({ force: true });
    this.repository.getAllStockInputs().check();
  };

  setPriceForAllStores = (productPrice: string): void => {
    this.repository.getPriceTaxTab().click();
    this.repository.getAllPriceInputs().each(($el) => {
      cy.wrap($el).type(productPrice, { force: true });
    });
  };

  save = (): void => {
    this.repository.getSaveButton().click();
  };
}
