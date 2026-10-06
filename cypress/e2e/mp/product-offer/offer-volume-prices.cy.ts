import { container } from '@utils';
import { OfferVolumePricesDynamicFixtures, OfferVolumePricesStaticFixtures } from '@interfaces/mp';
import { OffersPage } from '@pages/mp';
import { CartPage, CatalogPage, ProductPage } from '@pages/yves';
import { MerchantUserLoginScenario } from '@scenarios/mp';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'offer volume prices',
  {
    tags: [
      '@mp',
      '@product-offer',
      'prices',
      'cart',
      'marketplace-cart',
      'marketplace-product-offer',
      'marketplace-merchant-custom-prices',
      'marketplace-merchant-portal-product-offer-management',
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

    let staticFixtures: OfferVolumePricesStaticFixtures;
    let dynamicFixtures: OfferVolumePricesDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given an offer carrying a volume price when the merchant deletes that price row then the storefront falls back to the offer default price', (): void => {
      // Arrange
      cy.runCliCommands(publishAndSyncCommands);
      loginAsCustomer();
      openOfferOnProductDetailPage();

      // The tier is what the storefront charges while the volume price row exists.
      productPage.getProductDetailPrice().should('contain', staticFixtures.offerPrice);
      productPage.setQuantity({ quantity: staticFixtures.volumeTier.quantity });
      productPage.getProductDetailPrice().should('contain', staticFixtures.volumeTier.price);

      productPage.addToCart();
      cartPage.visit();
      cartPage
        .getProductCartItems()
        .filter(`:contains("${dynamicFixtures.merchantProduct.sku}")`)
        .should('have.length', 1)
        .and('contain.text', staticFixtures.volumeTier.price)
        .and('contain.text', dynamicFixtures.merchant.name);

      cartPage.clearCartIfNotEmpty();

      // Act
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      offersPage.visit();
      offersPage.find({ query: dynamicFixtures.merchantProduct.sku }).click();
      offersPage.deletePriceRowByQuantity({ quantity: staticFixtures.volumeTier.threshold });

      cy.runCliCommands(publishAndSyncCommands);

      // Assert
      loginAsCustomer();
      openOfferOnProductDetailPage();

      productPage.setQuantity({ quantity: staticFixtures.volumeTier.quantity });
      productPage.getProductDetailPrice().should('contain', staticFixtures.offerPrice);

      productPage.addToCart();
      cartPage.visit();
      cartPage
        .getProductCartItems()
        .filter(`:contains("${dynamicFixtures.merchantProduct.sku}")`)
        .should('have.length', 1)
        .and('contain.text', staticFixtures.offerPrice);
    });

    function loginAsCustomer(): void {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
    }

    function openOfferOnProductDetailPage(): void {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.merchantProduct.abstract_sku });

      productPage.getSoldByProductOffers().should('contain.text', dynamicFixtures.merchant.name);
      productPage.selectSoldByProductOffer({
        productOfferReference: dynamicFixtures.productOffer.product_offer_reference,
      });
    }
  }
);
