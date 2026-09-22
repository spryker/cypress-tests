import { container, getPaymentMethodBasedOnEnv } from '@utils';
import {
  ConfigurableProductCheckoutDynamicFixtures,
  ConfigurableProductCheckoutStaticFixtures,
} from '@interfaces/yves';
import { CartPage, CatalogPage, CustomerOverviewPage, ProductConfiguratorPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

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
  'configurable product checkout',
  {
    tags: ['@yves', 'configurable-product', 'product', 'cart', 'checkout', 'spryker-core'],
  },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const productConfiguratorPage = container.get(ProductConfiguratorPage);
    const cartPage = container.get(CartPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const checkoutScenario = container.get(CheckoutScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: ConfigurableProductCheckoutStaticFixtures;
    let dynamicFixtures: ConfigurableProductCheckoutDynamicFixtures;

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

    it('given a configurable product when it is configured on its detail page then the configuration completes and the chosen option reaches the cart', (): void => {
      // Arrange
      let chosenOptionTitle = '';
      openProductDetailPage();
      productPage.getProductConfigurationStatus().should('contain', staticFixtures.configurationNotCompleteStatus);

      // Act
      configureProduct(FIRST_CHOICE_OPTION_NUMBER, (title: string): void => {
        chosenOptionTitle = title;
      });

      // Assert
      productPage.getProductConfigurationStatus().should('contain', staticFixtures.configurationCompleteStatus);

      // Act
      productPage.addToCart();
      cartPage.visit();

      // Assert
      cartPage.getProductCartItems().should((items: JQuery<HTMLElement>): void => {
        expect(items.text()).to.contain(chosenOptionTitle);
      });
    });

    it('given a configured product in the cart when it is configured again from the cart then the cart carries the new configuration through checkout', (): void => {
      // Arrange
      let replacedOptionTitle = '';
      let reconfiguredOptionTitle = '';

      openProductDetailPage();
      configureProduct(FIRST_CHOICE_OPTION_NUMBER, (title: string): void => {
        replacedOptionTitle = title;
      });
      productPage.addToCart();
      cartPage.visit();

      // Act
      // The cart line carries the same configuration form as the detail page, so the configurator is
      // reachable from here without going back to the product.
      cartPage.configureProduct({ sku: dynamicFixtures.product.sku });
      selectConfiguratorOption(SECOND_CHOICE_OPTION_NUMBER, (title: string): void => {
        reconfiguredOptionTitle = title;
      });

      // Assert
      cartPage.getProductCartItems().should((items: JQuery<HTMLElement>): void => {
        expect(items.text()).to.contain(reconfiguredOptionTitle);
        expect(items.text()).to.not.contain(replacedOptionTitle);
      });

      // Act
      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        paymentMethod: getPaymentMethodBasedOnEnv(),
      });

      // Assert
      customerOverviewPage.assertBodyContainsText(customerOverviewPage.getPlacedOrderSuccessMessage());
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

    function configureProduct(optionNumber: number, captureOptionTitle: (title: string) => void): void {
      productPage.configure();
      selectConfiguratorOption(optionNumber, captureOptionTitle);
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
