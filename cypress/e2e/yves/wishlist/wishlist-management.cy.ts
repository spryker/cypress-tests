import { container } from '@utils';
import { CatalogPage, WishlistPage } from '@pages/yves';
import { WishlistManagementDynamicFixtures, WishlistManagementStaticFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe('wishlist management', { tags: ['@yves', '@wishlist', 'wishlist', 'spryker-core'] }, (): void => {
  if (Cypress.env('repositoryId') !== 'suite') {
    it.skip('skipped because tests run only for suite', () => {});
    return;
  }

  const customerLoginScenario = container.get(CustomerLoginScenario);
  const catalogPage = container.get(CatalogPage);
  const wishlistPage = container.get(WishlistPage);

  let staticFixtures: WishlistManagementStaticFixtures;
  let dynamicFixtures: WishlistManagementDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
  });

  it('customer should be able to add a product to a new wishlist', (): void => {
    const wishlistName = addProductToNewWishlist();

    wishlistPage.visit();
    wishlistPage.openWishlist(wishlistName);

    wishlistPage.getWishlistItemRow(dynamicFixtures.product.sku).should('be.visible');
  });

  it('customer should be able to remove a product from a wishlist', (): void => {
    const wishlistName = addProductToNewWishlist();
    wishlistPage.visit();
    wishlistPage.openWishlist(wishlistName);

    wishlistPage.removeItem(dynamicFixtures.product.sku);

    wishlistPage.getWishlistItemRow(dynamicFixtures.product.sku).should('not.exist');
  });

  function addProductToNewWishlist(): string {
    wishlistPage.visit();
    const wishlistName = wishlistPage.createWishlist();

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
    wishlistPage.getWishlistPicker().should('exist');
    wishlistPage.addDisplayedProductToWishlist(wishlistName);

    return wishlistName;
  }
});
