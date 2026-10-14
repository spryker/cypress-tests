import { container } from '@utils';
import {
  CustomerSpecificPricesCustomer,
  CustomerSpecificPricesDynamicFixtures,
  CustomerSpecificPricesProduct,
  CustomerSpecificPricesStaticFixtures,
} from '@interfaces/yves';
import { CartPage, CatalogPage, ProductPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';
import { retryableBefore } from '../../../support/e2e';

describe(
  'customer specific prices',
  { tags: ['@yves', 'prices', 'merchant-custom-prices', 'catalog', 'search', 'cart', 'spryker-core'] },
  (): void => {
    // A merchant relationship price is a B2B concept: the B2C repositories have neither the company
    // structure it hangs off nor demo data for it.
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because merchant relationship prices only exist in the B2B repositories', () => {});

      return;
    }

    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const cartPage = container.get(CartPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: CustomerSpecificPricesStaticFixtures;
    let dynamicFixtures: CustomerSpecificPricesDynamicFixtures;
    let defaultPriceCustomer: CustomerSpecificPricesCustomer;
    let merchantPriceCustomer: CustomerSpecificPricesCustomer;
    let product: CustomerSpecificPricesProduct;

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      if ('product' in staticFixtures) {
        ({ defaultPriceCustomer, merchantPriceCustomer, product } = staticFixtures);

        return;
      }

      ({ defaultPriceCustomer, merchantPriceCustomer } = dynamicFixtures);
      product = {
        abstractSku: dynamicFixtures.product.abstract_sku,
        concreteSku: dynamicFixtures.product.sku,
        name: dynamicFixtures.product.localized_attributes[0].name,
        cartItemName: dynamicFixtures.product.localized_attributes[0].name,
      };
    });

    it('given a customer whose company has no merchant specific price when the product is browsed then the default price is shown in the catalog and on the product detail page', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: defaultPriceCustomer.email,
        alternativeEmails: defaultPriceCustomer.alternativeEmails,
        password: staticFixtures.defaultPassword,
      });

      // Act
      // cy.session() restores cookies onto about:blank, so the header search form only exists once a
      // page has actually been loaded.
      catalogPage.visit();
      catalogPage.searchForProducts({ query: product.abstractSku });

      // Assert
      catalogPage
        .getProductItemBlocks()
        .filter(`:contains("${product.name}")`)
        .first()
        .should('contain', staticFixtures.prices.defaultPrice);

      // Act
      catalogPage.openProductDetailPageFromResults({ productName: product.name });

      // Assert
      productPage.getProductDetailPrice().should('contain', staticFixtures.prices.defaultPrice);
    });

    it('given a customer whose company has a merchant specific price when the product is browsed and added to the cart then that price replaces the default one on every surface', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: merchantPriceCustomer.email,
        alternativeEmails: merchantPriceCustomer.alternativeEmails,
        password: staticFixtures.defaultPassword,
      });

      // Act
      catalogPage.visit();
      catalogPage.searchForProducts({ query: product.abstractSku });

      // Assert
      catalogPage
        .getProductItemBlocks()
        .filter(`:contains("${product.name}")`)
        .first()
        .should('contain', staticFixtures.prices.merchantPrice);

      // Act
      catalogPage.openProductDetailPageFromResults({ productName: product.name });

      // Assert
      productPage.getProductDetailPrice().should('contain', staticFixtures.prices.merchantPrice);

      // Act
      productPage.addToCart();
      cartPage.visit();

      // Assert
      // Filtered by sku rather than cleared beforehand, so a cart left behind by an earlier run or a
      // retry cannot change what this reads.
      cartPage
        .getCartItems({ sku: product.concreteSku })
        .should('have.length', 1)
        .and('contain', product.cartItemName)
        .and('contain', staticFixtures.prices.merchantPrice);
    });
  }
);
