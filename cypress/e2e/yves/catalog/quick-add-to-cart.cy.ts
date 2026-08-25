import { container } from '@utils';
import { QuickAddToCartStaticFixtures } from '@interfaces/yves';
import { CartPage, CatalogPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';
import { retryableBefore } from '../../../support/e2e';

describe(
  'quick add to cart',
  { tags: ['@yves', 'catalog', 'search', 'cart', 'quick-add-to-cart', 'product-groups', 'spryker-core'] },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const cartPage = container.get(CartPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: QuickAddToCartStaticFixtures;

    retryableBefore((): void => {
      ({ staticFixtures } = Cypress.env());
    });

    const loginAndEmptyTheCart = (): void => {
      customerLoginScenario.execute({
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      cartPage.visit();
      cartPage.clearCartIfNotEmpty();
    };

    it('given a buyable product in the catalog when it is quick added from its card then it lands in the cart', (): void => {
      // Arrange
      loginAndEmptyTheCart();
      catalogPage.visit();
      catalogPage.searchForProducts({ query: staticFixtures.buyableProduct.searchQuery });

      // Act
      catalogPage.quickAddFirstProductItemToCart();

      // Assert
      cartPage.visit();
      cartPage.getProductCartItems().should('contain.text', staticFixtures.buyableProduct.cartEntry);
    });

    it('given an unbuyable product in the catalog when its card is read then no usable add to cart is offered', (): void => {
      // Arrange
      loginAndEmptyTheCart();
      catalogPage.visit();

      // Act
      catalogPage.searchForProducts({ query: staticFixtures.unbuyableProduct.searchQuery });

      // Assert
      // The card still renders the button, only disabled, so the absence of an *enabled* one is what
      // says the product cannot be bought from the catalog.
      catalogPage.getFirstProductItemEnabledAddToCartButton().should('not.exist');
    });

    it('given a product card offering its group siblings by colour when a sibling colour is picked and quick added then the sibling is what lands in the cart', (): void => {
      // Arrange
      loginAndEmptyTheCart();
      catalogPage.visit();
      catalogPage.searchForProducts({ query: staticFixtures.productGroup.searchQuery });

      // Act
      catalogPage.selectFirstProductItemColor({ swatchIdentifier: staticFixtures.productGroup.swatchIdentifier });
      catalogPage.quickAddFirstProductItemToCart();

      // Assert
      cartPage.visit();
      cartPage.getProductCartItems().should('contain.text', staticFixtures.productGroup.cartEntry);
    });
  }
);
