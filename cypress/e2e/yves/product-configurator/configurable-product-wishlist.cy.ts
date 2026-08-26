import { container } from '@utils';
import {
  ConfigurableProductWishlistDynamicFixtures,
  ConfigurableProductWishlistStaticFixtures,
} from '@interfaces/yves';
import { CartPage, CatalogPage, ProductConfiguratorPage, ProductPage, WishlistPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

// Option one of each group is preselected, so picking the second is what makes a saved configuration
// differ from the default — and going back to the first is what makes a re-configuration differ from
// the one already saved.
const CONFIGURED_GROUP_NUMBER = 1;

const FIRST_CHOICE_OPTION_NUMBER = 2;

const SECOND_CHOICE_OPTION_NUMBER = 1;

const CONFIGURE_BUTTON_SELECTOR = '[data-qa="component configuration-form"] button';

const PUBLISH_RELOAD_ATTEMPTS = 20;

const PUBLISH_RELOAD_INTERVAL_MS = 3000;

describe(
  'configurable product wishlist',
  {
    tags: ['@yves', 'configurable-product', 'configurable-product-wishlist', 'wishlist', 'product', 'spryker-core'],
  },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const productConfiguratorPage = container.get(ProductConfiguratorPage);
    const wishlistPage = container.get(WishlistPage);
    const cartPage = container.get(CartPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: ConfigurableProductWishlistStaticFixtures;
    let dynamicFixtures: ConfigurableProductWishlistDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      cartPage.visit();
      cartPage.clearCartIfNotEmpty();
    });

    it('given a configurable product configured on its detail page when it is wishlisted and configured again from the wishlist then the wishlist carries the newer configuration', (): void => {
      // Arrange
      let replacedOptionTitle = '';
      let reconfiguredOptionTitle = '';
      const wishlistName = wishlistWithConfiguredProduct((title: string): void => {
        replacedOptionTitle = title;
      });

      // Assert
      // The configuration made on the detail page travels with the product into the wishlist.
      wishlistPage.getWishlistItemsTable().should((table: JQuery<HTMLElement>): void => {
        expect(table.text()).to.contain(dynamicFixtures.product.sku);
        expect(table.text()).to.contain(replacedOptionTitle);
      });

      // Act
      wishlistPage.configureProduct({ sku: dynamicFixtures.product.sku });
      selectConfiguratorOption(SECOND_CHOICE_OPTION_NUMBER, (title: string): void => {
        reconfiguredOptionTitle = title;
      });

      // Assert
      wishlistPage.visit();
      wishlistPage.openWishlist(wishlistName);
      wishlistPage.getWishlistItemsTable().should((table: JQuery<HTMLElement>): void => {
        expect(table.text()).to.contain(reconfiguredOptionTitle);
        expect(table.text()).to.not.contain(replacedOptionTitle);
      });
    });

    it('given a configured wishlist item when every available item is moved to the cart then the cart carries its configuration', (): void => {
      // Arrange
      let configuredOptionTitle = '';
      wishlistWithConfiguredProduct((title: string): void => {
        configuredOptionTitle = title;
      });

      // Act
      wishlistPage.moveAllAvailableProductsToCart();

      // Assert
      cartPage.visit();
      cartPage.getProductCartItems().should((items: JQuery<HTMLElement>): void => {
        expect(items.text()).to.contain(dynamicFixtures.product.sku);
        expect(items.text()).to.contain(configuredOptionTitle);
      });
    });

    // Leaves the browser on the wishlist detail page, holding the configured product.
    function wishlistWithConfiguredProduct(captureOptionTitle: (title: string) => void): string {
      wishlistPage.visit();
      const wishlistName = wishlistPage.createWishlist();

      openProductDetailPage();
      productPage.configure();
      selectConfiguratorOption(FIRST_CHOICE_OPTION_NUMBER, captureOptionTitle);
      productPage.getProductConfigurationStatus().should('contain', staticFixtures.configurationCompleteStatus);

      wishlistPage.getWishlistPicker().should('exist');
      wishlistPage.addDisplayedProductToWishlist(wishlistName);

      wishlistPage.visit();
      wishlistPage.openWishlist(wishlistName);

      return wishlistName;
    }

    // A freshly created product's configuration can still be propagating to storage, and until it
    // lands the detail page renders no configure button at all.
    function openProductDetailPage(): void {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });

      cy.url().then((productUrl: string) => {
        cy.reloadUntilFound(
          productUrl,
          CONFIGURE_BUTTON_SELECTOR,
          'body',
          PUBLISH_RELOAD_ATTEMPTS,
          PUBLISH_RELOAD_INTERVAL_MS
        );
      });
    }

    function selectConfiguratorOption(optionNumber: number, captureOptionTitle: (title: string) => void): void {
      productConfiguratorPage.getHeading().should('be.visible');
      productConfiguratorPage
        .getOptionTitle(CONFIGURED_GROUP_NUMBER, optionNumber)
        .then((title: string): void => captureOptionTitle(title));
      productConfiguratorPage.selectOption(CONFIGURED_GROUP_NUMBER, optionNumber);
      productConfiguratorPage.save();
    }
  }
);
