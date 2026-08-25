import { container } from '@utils';
import { CartPage, CatalogPage, CustomerOverviewPage, ProductPage, WishlistPage } from '@pages/yves';
import { GuestAccessRestrictionsDynamicFixtures, GuestAccessRestrictionsStaticFixtures } from '@interfaces/yves';

describe(
  'guest access restrictions',
  {
    tags: ['@yves', '@customer-account-management', 'spryker-core', 'customer-account-management', 'customer-access'],
  },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const cartPage = container.get(CartPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const wishlistPage = container.get(WishlistPage);

    let dynamicFixtures: GuestAccessRestrictionsDynamicFixtures;
    let staticFixtures: GuestAccessRestrictionsStaticFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('guest should be able to buy a product from the detail page into the cart', (): void => {
      // Arrange
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
      productPage.getAddToCartButton().should('be.visible');

      // Act
      productPage.addToCart();
      cartPage.visit();

      // Assert
      cartPage.getProductCartItems().should('contain.text', dynamicFixtures.product.sku);
      cartPage.getCartSummary().should('contain.text', staticFixtures.cartTotal);
    });

    // The account area a guest must not reach. Each entry bounces to the login page instead of
    // rendering, which is the access restriction this spec exists to prove.
    const customerOnlyPages = [
      { name: 'customer overview', page: customerOverviewPage },
      { name: 'wishlist', page: wishlistPage },
    ];

    customerOnlyPages.forEach(({ name, page }): void => {
      it(`guest should be sent to login when opening the ${name} page`, (): void => {
        // Act
        page.visit();

        // Assert
        cy.url().should('include', '/login');
      });
    });
  }
);
