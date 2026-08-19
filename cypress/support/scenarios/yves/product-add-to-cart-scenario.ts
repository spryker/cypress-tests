import { CartPage, CatalogPage, ProductPage } from '@pages/yves';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

// b2c-style storefronts have no quick-add form, so the product has to be reached through catalog
// search and added from its PDP; the b2b-style ones quick-add by SKU straight from the cart page.
const CATALOG_SEARCH_REPOSITORY_IDS = ['b2c', 'b2c-mp'];

const ADD_TO_CART_BUTTON = '[data-qa="add-to-cart-button"]';

const PUBLISH_RELOAD_ATTEMPTS = 20;

const PUBLISH_RELOAD_INTERVAL_MS = 3000;

@injectable()
@autoWired
export class ProductAddToCartScenario {
  @inject(CartPage) private cartPage: CartPage;
  @inject(CatalogPage) private catalogPage: CatalogPage;
  @inject(ProductPage) private productPage: ProductPage;

  execute = (params: ExecuteParams): void => {
    const quantity = params.quantity ?? 1;

    if (!CATALOG_SEARCH_REPOSITORY_IDS.includes(Cypress.env('repositoryId'))) {
      this.cartPage.visit();
      this.cartPage.quickAddToCart({ sku: params.sku, quantity });

      return;
    }

    this.catalogPage.visit();
    this.catalogPage.searchProductFromSuggestions({ query: params.sku });

    // A freshly created product's availability/concrete data can still be propagating to storage
    // right after fixture setup; until it lands the PDP hides the add-to-cart button. Reload the
    // product page until the button is published before interacting with it.
    cy.url().then((productUrl) => {
      cy.reloadUntilFound(productUrl, ADD_TO_CART_BUTTON, 'body', PUBLISH_RELOAD_ATTEMPTS, PUBLISH_RELOAD_INTERVAL_MS);
    });

    this.productPage.addToCart({ quantity });
  };
}

interface ExecuteParams {
  sku: string;
  quantity?: number;
}
