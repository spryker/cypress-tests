import { container } from '@utils';
import {
  ConfigurableProductShoppingListDynamicFixtures,
  ConfigurableProductShoppingListStaticFixtures,
} from '@interfaces/yves';
import { CartPage, CatalogPage, ProductConfiguratorPage, ProductPage, ShoppingListPage } from '@pages/yves';
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
  'configurable product shopping list',
  {
    tags: [
      '@yves',
      'configurable-product',
      'configurable-product-shopping-lists',
      'shopping-lists',
      'product',
      'cart',
      'spryker-core',
    ],
  },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const productConfiguratorPage = container.get(ProductConfiguratorPage);
    const shoppingListPage = container.get(ShoppingListPage);
    const cartPage = container.get(CartPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: ConfigurableProductShoppingListStaticFixtures;
    let dynamicFixtures: ConfigurableProductShoppingListDynamicFixtures;

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

    it('given a configurable product when it is added to the cart without being configured then the cart states that it cannot be processed', (): void => {
      // Arrange
      openProductDetailPage();
      productPage.getProductConfigurationStatus().should('contain', staticFixtures.configurationNotCompleteStatus);

      // Act
      productPage.addToCart();
      cartPage.visit();

      // Assert
      // The cart says so on the cart page rather than waiting for a checkout attempt — the checkout
      // itself is still entered, so the message is what carries the refusal at this point.
      cartPage.assertBodyContainsText(staticFixtures.unconfiguredCheckoutBlockedMessage);
    });

    it('given a configured product stocked with a limited number of items when more than that is added then the cart refuses the excess', (): void => {
      // Arrange
      openProductDetailPage();
      productPage.configure();
      selectConfiguratorOption(FIRST_CHOICE_OPTION_NUMBER, (): void => undefined);
      productPage.getProductConfigurationStatus().should('contain', staticFixtures.configurationCompleteStatus);

      // Act
      productPage.setQuantity({ quantity: staticFixtures.availableStock + 1 });
      productPage.addToCart();

      // Assert
      cartPage.assertBodyContainsText(`only has availability of ${staticFixtures.availableStock}`);
    });

    it('given a configured product in a shopping list when it is configured again from the list then the list and the cart both carry the newer configuration', (): void => {
      // Arrange
      let replacedOptionTitle = '';
      let reconfiguredOptionTitle = '';

      shoppingListPage.visit();
      const shoppingListName = shoppingListPage.createShoppingList();

      openProductDetailPage();
      productPage.configure();
      selectConfiguratorOption(FIRST_CHOICE_OPTION_NUMBER, (title: string): void => {
        replacedOptionTitle = title;
      });
      shoppingListPage.addDisplayedProductToShoppingList(shoppingListName);

      shoppingListPage.visit();
      shoppingListPage.openShoppingList(shoppingListName);

      // Act
      shoppingListPage.configureProduct({ sku: dynamicFixtures.product.sku });
      selectConfiguratorOption(SECOND_CHOICE_OPTION_NUMBER, (title: string): void => {
        reconfiguredOptionTitle = title;
      });

      // Assert
      shoppingListPage.getShoppingListItemsTable().should((table: JQuery<HTMLElement>): void => {
        expect(table.text()).to.contain(reconfiguredOptionTitle);
        expect(table.text()).to.not.contain(replacedOptionTitle);
      });

      // Act
      shoppingListPage.addAllAvailableProductsToCart();

      // Assert
      cartPage.visit();
      cartPage.getProductCartItems().should((items: JQuery<HTMLElement>): void => {
        expect(items.text()).to.contain(dynamicFixtures.product.sku);
        expect(items.text()).to.contain(reconfiguredOptionTitle);
      });
    });

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
