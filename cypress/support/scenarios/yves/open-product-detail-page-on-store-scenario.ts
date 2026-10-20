import { autoWired } from '@utils';
import { CatalogPage, ProductPage } from '@pages/yves';
import { inject, injectable } from 'inversify';
import { SelectStoreScenario } from './select-store-scenario';

// The suggestion dropdown ranks by completion, so a sku query can put a sibling product first and a
// spec would then read prices, offers or a 404 off the wrong detail page. Going through the result
// blocks and matching on the product name keeps it exact, and the closing check makes a wrong landing
// fail here rather than as a mystery timeout further down.
@injectable()
@autoWired
export class OpenProductDetailPageOnStoreScenario {
  @inject(SelectStoreScenario) private selectStoreScenario: SelectStoreScenario;
  @inject(CatalogPage) private catalogPage: CatalogPage;
  @inject(ProductPage) private productPage: ProductPage;

  execute = (params: ExecuteParams): void => {
    this.selectStoreScenario.execute(params.storeName);
    this.catalogPage.searchForProducts({ query: params.abstractSku });
    this.catalogPage.openProductDetailPageFromResults({ productName: params.productName });
    this.productPage.getProductConfigurator().should('contain', params.sku);
  };
}

interface ExecuteParams {
  storeName: string;
  abstractSku: string;
  sku: string;
  productName: string;
}
