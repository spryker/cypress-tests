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

    it('given a customer owning two wishlists when a product is added to each of them then each wishlist holds only its own product', (): void => {
      // Arrange
      wishlistPage.visit();
      const firstWishlistName = wishlistPage.createWishlist();

      wishlistPage.visit();
      const secondWishlistName = wishlistPage.createWishlist();

      // Act
      visitProductDetailPage(dynamicFixtures.product1.sku);
      wishlistPage.addDisplayedProductToWishlist(firstWishlistName);

      visitProductDetailPage(dynamicFixtures.product2.sku);
      wishlistPage.addDisplayedProductToWishlist(secondWishlistName);

      // Assert
      // Each wishlist holds its own product and not the other one, which is what proves the picker
      // routed the second product somewhere else than the first.
      const wishlistContents = [
        { name: firstWishlistName, ownSku: dynamicFixtures.product1.sku, otherSku: dynamicFixtures.product2.sku },
        { name: secondWishlistName, ownSku: dynamicFixtures.product2.sku, otherSku: dynamicFixtures.product1.sku },
      ];

      wishlistContents.forEach(({ name, ownSku, otherSku }): void => {
        wishlistPage.visit();
        wishlistPage.openWishlist(name);

        wishlistPage.getWishlistItemsTable().should('contain.text', ownSku).and('not.contain.text', otherSku);
      });
    });

    it('given a product detail page rendered for a logged-in customer when the session is dropped and the product is added to a wishlist then the customer is sent to the login page', (): void => {
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
