import { container } from '@utils';
import {
  DiscontinuedAlternativeProductsDynamicFixtures,
  DiscontinuedAlternativeProductsStaticFixtures,
} from '@interfaces/yves';
import { CatalogPage, ProductPage, WishlistPage } from '@pages/yves';
import { ProductDiscontinuedPage } from '@pages/backoffice';
import { CustomerLoginScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'discontinued and alternative products',
  {
    tags: ['@yves', 'product', 'discontinued-products', 'alternative-products', 'wishlist', 'spryker-core'],
  },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const wishlistPage = container.get(WishlistPage);
    const productDiscontinuedPage = container.get(ProductDiscontinuedPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: DiscontinuedAlternativeProductsStaticFixtures;
    let dynamicFixtures: DiscontinuedAlternativeProductsDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a discontinued product carrying an alternative when its product detail page is opened then the alternative is offered there', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      catalogPage.visit();

      // Act
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.discontinuedProduct.sku });

      // Assert
      productPage
        .getAlternativeProductsSlider()
        .should('contain.text', dynamicFixtures.substituteProduct.localized_attributes[0].name);
    });

    it('given a wishlisted product that is then discontinued when the wishlist is opened then the item is flagged discontinued and its alternative is listed beside it', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      wishlistPage.visit();
      const wishlistName = wishlistPage.createWishlist();

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.wishlistProduct.sku });

      // The picker is filled in by an ajax call after page load, so reading it waits for the widget
      // to be able to route the add.
      wishlistPage.getWishlistPicker().should('exist');
      wishlistPage.addDisplayedProductToWishlist(wishlistName);

      // Act
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      productDiscontinuedPage.discontinueProduct({
        idProductConcrete: dynamicFixtures.wishlistProduct.id_product_concrete,
      });

      // The wishlist row reads the discontinued flag and the alternatives out of storage, not out of
      // the database the back office just wrote to.
      cy.runQueueWorker();

      // Assert
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      wishlistPage.visit();
      wishlistPage.openWishlist(wishlistName);

      wishlistPage
        .getWishlistItemsTable()
        .should('contain.text', dynamicFixtures.wishlistProduct.sku)
        .and('contain.text', staticFixtures.discontinuedLabel)
        .and('contain.text', staticFixtures.alternativeLabel)
        .and('contain.text', dynamicFixtures.wishlistSubstituteProduct.sku);
    });
  }
);
