import { container } from '@utils';
import { CartPage, CatalogPage, ProductPage, WishlistPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';
import { WishlistProductOffersDynamicFixtures, WishlistProductOffersStaticFixtures } from '@interfaces/yves';

describe(
  'wishlist product offers',
  {
    tags: [
      '@yves',
      '@wishlist',
      'wishlist',
      'marketplace-wishlist',
      'product',
      'marketplace-product',
      'marketplace-product-offer',
    ],
  },
  (): void => {
    if (!['suite', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('runs only where a product can carry competing merchant offers', (): void => {});

      return;
    }

    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const wishlistPage = container.get(WishlistPage);
    const cartPage = container.get(CartPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let dynamicFixtures: WishlistProductOffersDynamicFixtures;
    let staticFixtures: WishlistProductOffersStaticFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('customer should be able to keep two merchant offers of one product in a wishlist and in the cart', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      wishlistPage.visit();
      wishlistPage.createWishlist(staticFixtures.wishlistName);

      // The same product is on sale from two merchants, so every step below has to stay tied to the
      // offer it started from rather than to the product.
      const competingOffers = [
        { offer: dynamicFixtures.productOffer1, merchant: dynamicFixtures.merchant1 },
        { offer: dynamicFixtures.productOffer2, merchant: dynamicFixtures.merchant2 },
      ];

      // Act
      competingOffers.forEach(({ offer }): void => {
        catalogPage.visit();
        catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
        productPage.selectSoldByProductOffer({ productOfferReference: offer.product_offer_reference });
        wishlistPage.getAddToWishlistProductOfferInput().should('have.value', offer.product_offer_reference);

        wishlistPage.addDisplayedProductToWishlist(staticFixtures.wishlistName);
      });

      // Assert
      wishlistPage.visit();
      wishlistPage.openWishlist(staticFixtures.wishlistName);

      competingOffers.forEach(({ merchant }): void => {
        wishlistPage.getWishlistItemsTable().should('contain.text', `${staticFixtures.soldByText} ${merchant.name}`);
      });

      wishlistPage.moveAllAvailableProductsToCart();
      cartPage.visit();

      competingOffers.forEach(({ merchant }): void => {
        cartPage.getProductCartItems().should('contain.text', `${staticFixtures.soldByText} ${merchant.name}`);
      });
    });
  }
);
