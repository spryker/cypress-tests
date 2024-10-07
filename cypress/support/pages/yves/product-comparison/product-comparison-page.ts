import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { ProductComparisonRepository } from './product-comparison-repository';

@injectable()
@autoWired
export class ProductComparisonPage extends YvesPage {
  @inject(REPOSITORIES.ProductComparisonRepository) private repository: ProductComparisonRepository;

  protected PAGE_URL = '/product-comparison';

  removeProductFromComparisonList = (sku: string): void => {
    this.repository.getDeleteFromComparisonButton(sku).click();
  };

  clearComparisonList = (): void => {
    this.repository.getClearComparisonListButton().click();
  };

  getComparisonPageNavigationLinkSelector = (): string => {
    return this.repository.getComparisonPageNavigationLinkSelector();
  };

  getProductItemsSelector = (): string => {
    return this.repository.getProductItemSelector();
  };

  getProductComparisonListIsEmptyMessage = (): string => {
    return this.repository.getProductComparisonListIsEmptyMessage();
  };

  getComparisonTableRowSelector = (): string => {
    return this.repository.getComparisonTableRowSelector();
  };
}
