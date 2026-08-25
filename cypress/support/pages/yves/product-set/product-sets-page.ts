import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { ProductSetsRepository } from './product-sets-repository';

@injectable()
@autoWired
export class ProductSetsPage extends YvesPage {
  @inject(ProductSetsRepository) private repository: ProductSetsRepository;

  protected PAGE_URL = '/product-sets';

  visitProductSet = (urlKey: string): void => {
    cy.visit(`/en/${urlKey}`);
  };

  getProductSetCard = (name: string): Cypress.Chainable =>
    cy.contains(this.repository.getProductSetCardSelector(), name);

  openProductSet = (name: string): void => {
    this.getProductSetCard(name).click();
  };

  getProductSetDetails = (): Cypress.Chainable => this.repository.getProductSetDetails();

  getProductSetProductItems = (): Cypress.Chainable => this.repository.getProductSetProductItems();

  selectProductVariant = (params: SelectProductVariantParams): void => {
    this.repository.getVariantSelect(params.productName).select(params.sku);
  };

  addAllProductsToCart = (): void => {
    // The button ships disabled and the storefront javascript enables it once every slot in the set
    // has a concrete product picked, so clicking before that is a silent no-op.
    this.repository.getAddAllToCartButton().should('be.enabled');
    this.repository.getAddAllToCartButton().click();
  };

  waitUntilProductSetIsPublished = (urlKey: string): void => {
    cy.reloadUntilFound(`/en/${urlKey}`, this.repository.getProductSetDetailsSelector(), 'body', 15, 3000, [
      'console queue:worker:start --stop-when-empty',
    ]);
  };

  waitUntilProductSetIsGone = (urlKey: string): void => {
    cy.reloadUntilGone(`/en/${urlKey}`, this.repository.getProductSetDetailsSelector(), 'body', 15, 3000, [
      'console queue:worker:start --stop-when-empty',
    ]);
  };
}

interface SelectProductVariantParams {
  productName: string;
  sku: string;
}
