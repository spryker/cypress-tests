import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ProductManagementEditVariantRepository } from './product-management-edit-variant-repository';

@injectable()
@autoWired
export class ProductManagementEditVariantPage extends BackofficePage {
  @inject(ProductManagementEditVariantRepository) private repository: ProductManagementEditVariantRepository;

  protected PAGE_URL = '/product-management/edit/variant';

  activate = (): void => {
    this.repository.getActivateButton().click();

    this.repository.getSearchableDECheckbox().check();
    this.repository.getEnUsCollapsedBlock().click();
    this.repository.getSearchableENCheckbox().check();

    this.repository.getPriceStockTab().click();
    this.repository.getIsNeverOutOfStockCheckbox().check();

    this.repository.getSaveButton().click();
  };

  deactivate = (): void => {
    this.repository.getDeactivateButton().click();
  };
}
