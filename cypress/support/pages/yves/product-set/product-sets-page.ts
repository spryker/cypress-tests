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
    this.getProductSetCard(name).find(this.repository.getProductSetCardLinkSelector()).first().click();
  };

  getProductSetDetails = (): Cypress.Chainable => this.repository.getProductSetDetails();

  getProductSetProductItems = (): Cypress.Chainable => this.repository.getProductSetProductItems();

  selectProductVariant = (params: SelectProductVariantParams): void => {
    this.repository.getVariantSelect(params.productName, params.attributeKey).select(params.attributeValue);
  };

  addAllProductsToCart = (): void => {
    // The button ships disabled and the storefront enables it once every product in the set has a
    // concrete resolved, so clicking before a variant is picked is a silent no-op.
    this.repository.getAddAllToCartButton().should('be.enabled');
    this.repository.getAddAllToCartButton().click();
  };

  waitUntilProductSetIsPublished = (urlKey: string): void => {
    cy.reloadUntilFound(`/en/${urlKey}`, this.repository.getProductSetDetailsSelector(), 'body', 15, 3000, [
      'console queue:worker:start --stop-when-empty',
    ]);
  };

  waitUntilProductSetIsListed = (name: string): void => {
    cy.reloadUntilFound(
      this.PAGE_URL,
      `${this.repository.getProductSetCardSelector()}:contains("${name}")`,
      'body',
      15,
      3000,
      ['console queue:worker:start --stop-when-empty']
    );
  };

  waitUntilProductSetIsGone = (urlKey: string): void => {
    cy.reloadUntilGone(`/en/${urlKey}`, this.repository.getProductSetDetailsSelector(), 'body', 15, 3000, [
      'console queue:worker:start --stop-when-empty',
    ]);
  };
}

interface SelectProductVariantParams {
  productName: string;
  attributeKey: string;
  attributeValue: string;
}
