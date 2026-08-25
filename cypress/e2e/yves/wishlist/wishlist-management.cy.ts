import { container } from '@utils';
import { CatalogPage, WishlistPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';
import { WishlistManagementDynamicFixtures, WishlistManagementStaticFixtures } from '@interfaces/yves';

describe(
  'wishlist management',
  {
    tags: ['@yves', '@wishlist', 'wishlist', 'spryker-core', 'customer-account-management'],
  },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const wishlistPage = container.get(WishlistPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let dynamicFixtures: WishlistManagementDynamicFixtures;
    let staticFixtures: WishlistManagementStaticFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
    });

    it('customer should be able to keep two products in two separate wishlists', (): void => {
      // Arrange
      // The customer owns no wishlist yet, so adding from the product detail page without picking
      // one creates the default wishlist and puts the product straight into it.
      visitProductDetailPage(dynamicFixtures.product1.sku);
      wishlistPage.addDisplayedProductToDefaultWishlist();

      wishlistPage.visit();
      wishlistPage.createWishlist(staticFixtures.secondWishlistName);

      // Act
      visitProductDetailPage(dynamicFixtures.product2.sku);
      wishlistPage.addDisplayedProductToWishlist(staticFixtures.secondWishlistName);

      // Assert
      // Each wishlist holds its own product and not the other one, which is what proves the picker
      // routed the second product somewhere else than the first.
      const wishlistContents = [
        {
          name: staticFixtures.defaultWishlistName,
          ownSku: dynamicFixtures.product1.sku,
          otherSku: dynamicFixtures.product2.sku,
        },
        {
          name: staticFixtures.secondWishlistName,
          ownSku: dynamicFixtures.product2.sku,
          otherSku: dynamicFixtures.product1.sku,
        },
      ];

      wishlistContents.forEach(({ name, ownSku, otherSku }): void => {
        wishlistPage.visit();
        wishlistPage.openWishlist(name);

        wishlistPage.getWishlistItemsTable().should('contain.text', ownSku).and('not.contain.text', otherSku);
      });
    });

    it('customer should be sent to login when adding to a wishlist without a session', (): void => {
      // Arrange
      // The page is rendered for a logged-in customer, then the session is dropped, so the add
      // request reaches the server unauthenticated with the form already on screen.
      visitProductDetailPage(dynamicFixtures.product1.sku);
      wishlistPage.getWishlistPicker().should('exist');
      wishlistPage.clearSessionCookie();

      // Act
      wishlistPage.getAddToWishlistForm().submit();

      // Assert
      cy.url().should('include', '/login');
    });

    function visitProductDetailPage(sku: string): void {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: sku });
    }
  }
);
