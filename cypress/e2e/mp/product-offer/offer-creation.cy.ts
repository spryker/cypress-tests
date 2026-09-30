import { container } from '@utils';
import { OfferCreationDynamicFixtures, OfferCreationStaticFixtures } from '@interfaces/mp';
import { OffersPage } from '@pages/mp';
import { CartPage, CatalogPage, ProductPage } from '@pages/yves';
import { MerchantUserLoginScenario } from '@scenarios/mp';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'offer creation',
  {
    tags: [
      '@mp',
      '@product-offer',
      'marketplace-product-offer',
      'product-offer',
      'marketplace-merchant-portal-product-offer-management',
      'cart',
      'marketplace-cart',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because product offers exist only in suite, b2b-mp and b2c-mp', () => {});

      return;
    }

    const offersPage = container.get(OffersPage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const cartPage = container.get(CartPage);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    // A tree-wide publish times the gateway out, so this stays narrowed to what the journey reads.
    const publishAndSyncCommands = [
      'console publish:trigger-events -r product_abstract',
      'console publish:trigger-events -r product_offer',
      'console publish:trigger-events -r price_product_offer',
      'console queue:worker:start --stop-when-empty',
    ];

    let staticFixtures: OfferCreationStaticFixtures;
    let dynamicFixtures: OfferCreationDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a product owned by another merchant when a merchant creates an offer on it then the storefront sells it under that merchant at the offer price', (): void => {
      // Arrange
      const merchantSku = `MERCHANT-SKU-${Date.now()}`;

      merchantUserLoginScenario.execute({
        username: dynamicFixtures.offerMerchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      offersPage.visit();

      // Act
      offersPage.createOffer({
        concreteSku: dynamicFixtures.merchantProduct.sku,
        merchantSku: merchantSku,
        storeName: staticFixtures.storeName,
        currency: staticFixtures.currency,
        netAmount: staticFixtures.offer.netAmount,
        grossAmount: staticFixtures.offer.grossAmount,
        stockQuantity: staticFixtures.offer.stockQuantity,
      });

      cy.runCliCommands(publishAndSyncCommands);

      // Assert
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      cartPage.visit();
      cartPage.clearCartIfNotEmpty();

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.merchantProduct.abstract_sku });

      productPage.getSoldByProductOffers().should('contain.text', dynamicFixtures.offerMerchant.name);
      productPage.getSoldByProductOffers().should('contain.text', staticFixtures.offer.displayedPrice);

      productPage
        .getSoldByProductOffers()
        .contains(dynamicFixtures.offerMerchant.name)
        .closest('[data-qa="component buy-box-item"]')
        .find('input[type="radio"]')
        .check({ force: true });
      productPage.addToCart();

      cartPage.visit();
      cartPage
        .getProductCartItems()
        .filter(`:contains("${dynamicFixtures.merchantProduct.sku}")`)
        .should('have.length', 1)
        .and('contain.text', dynamicFixtures.offerMerchant.name)
        .and('contain.text', staticFixtures.offer.displayedPrice);
    });
  }
);
