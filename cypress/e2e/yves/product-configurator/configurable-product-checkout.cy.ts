import { container, getPaymentMethodBasedOnEnv, skipWhenFeatureAbsent } from '@utils';
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

describe(
  'configurable product checkout',
  {
    tags: ['@yves', 'configurable-product', 'product', 'cart', 'checkout', 'spryker-core'],
  },
  (): void => {
    skipWhenFeatureAbsent('dateTimeConfigurator', ['b2b']);

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
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
      productPage.reloadUntilConfigurable();
      productPage.getProductConfigurationStatus().should('contain', staticFixtures.configurationNotCompleteStatus);

      // Act
      productPage.configure();
      productConfiguratorPage
        .getOptionTitle(CONFIGURED_GROUP_NUMBER, FIRST_CHOICE_OPTION_NUMBER)
        .then((title: string): void => {
          chosenOptionTitle = title;
        });
      productConfiguratorPage.chooseOption({
        groupNumber: CONFIGURED_GROUP_NUMBER,
        optionNumber: FIRST_CHOICE_OPTION_NUMBER,
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

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
      productPage.reloadUntilConfigurable();
      productPage.configure();
      productConfiguratorPage
        .getOptionTitle(CONFIGURED_GROUP_NUMBER, FIRST_CHOICE_OPTION_NUMBER)
        .then((title: string): void => {
          replacedOptionTitle = title;
        });
      productConfiguratorPage.chooseOption({
        groupNumber: CONFIGURED_GROUP_NUMBER,
        optionNumber: FIRST_CHOICE_OPTION_NUMBER,
      });
      productPage.addToCart();
      cartPage.visit();

      // Act
      // The cart line carries the same configuration form as the detail page, so the configurator is
      // reachable from here without going back to the product.
      cartPage.configureProduct({ sku: dynamicFixtures.product.sku });
      productConfiguratorPage
        .getOptionTitle(CONFIGURED_GROUP_NUMBER, SECOND_CHOICE_OPTION_NUMBER)
        .then((title: string): void => {
          reconfiguredOptionTitle = title;
        });
      productConfiguratorPage.chooseOption({
        groupNumber: CONFIGURED_GROUP_NUMBER,
        optionNumber: SECOND_CHOICE_OPTION_NUMBER,
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
  }
);
