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

    let staticFixtures: OfferVolumePricesStaticFixtures;
    let dynamicFixtures: OfferVolumePricesDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      // A tree-wide publish times the gateway out, so this stays narrowed to what the storefront reads.
      cy.runCliCommands([
        `console publish:trigger-events -r product_abstract -i ${dynamicFixtures.merchantProduct.fk_product_abstract}`,
        `console publish:trigger-events -r product_offer -i ${dynamicFixtures.productOffer.id_product_offer}`,
        `console publish:trigger-events -r price_product_offer -i ${dynamicFixtures.productOfferPrice.id_price_product_offer}`,
        'console queue:worker:start --stop-when-empty',
      ]);
    });

    it('given an offer carrying a volume price when the merchant deletes that price row then the offer no longer lists it', (): void => {
      // Arrange
      const offerReference = dynamicFixtures.editableProductOffer.product_offer_reference;

      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      // Act
      offersPage.openOffer({ query: offerReference });
      offersPage.deletePriceRowByQuantity({ quantity: staticFixtures.volumeTier.threshold });

      // Assert
      offersPage.openOffer({ query: offerReference });
      offersPage.getPriceRowsByQuantity({ quantity: staticFixtures.volumeTier.threshold }).should('have.length', 0);
    });

    it('given an offer carrying a volume price when a customer orders more than its threshold then the storefront charges the volume price', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      cartPage.visit();
      cartPage.clearCartIfNotEmpty();

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.merchantProduct.abstract_sku });
      productPage.selectSoldByProductOffer({
        productOfferReference: dynamicFixtures.productOffer.product_offer_reference,
      });
      productPage.getProductDetailPrice().should('contain', staticFixtures.offerPrice);

      // Act
      productPage.setQuantity({ quantity: staticFixtures.volumeTier.quantity });

      // Assert
      productPage.getProductDetailPrice().should('contain', staticFixtures.volumeTier.price);

      // Act
      productPage.addToCart();

      // Assert
      cartPage.visit();
      cartPage
        .getCartItemsChargingUnitPrice({
          sku: dynamicFixtures.merchantProduct.sku,
          unitPrice: staticFixtures.volumeTier.price,
          quantity: staticFixtures.volumeTier.quantity,
        })
        .should('have.length', 1)
        .and('contain.text', dynamicFixtures.merchant.name);
    });
  }
);
