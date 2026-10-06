import { container, getPaymentMethodBasedOnEnv } from '@utils';
import {
  BundleSlotSelection,
  ConfigurableBundleCheckoutDynamicFixtures,
  ConfigurableBundleCheckoutStaticFixtures,
} from '@interfaces/yves';
import { BundleConfiguratorPage, CartPage, CustomerOverviewPage, OrderDetailsPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

describe(
  'configurable bundle checkout',
  {
    tags: ['@yves', '@merchandising', 'configurable-bundle', 'product', 'cart', 'checkout', 'spryker-core'],
  },
  (): void => {
    const bundleConfiguratorPage = container.get(BundleConfiguratorPage);
    const cartPage = container.get(CartPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const orderDetailsPage = container.get(OrderDetailsPage);
    const checkoutScenario = container.get(CheckoutScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: ConfigurableBundleCheckoutStaticFixtures;
    let dynamicFixtures: ConfigurableBundleCheckoutDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    // The bundle templates and the products their slots offer are demo data, and only the suite,
    // b2b and b2c shops ship them - the two marketplace shops carry no clone of this journey either.
    shopsWithBundleTemplatesIt(
      'given two configurations of one bundle template when one of them is doubled in the cart and the order is placed then the order carries three bundles',
      (): void => {
        // Arrange
        customerLoginScenario.execute({
          email: dynamicFixtures.customer.email,
          password: staticFixtures.defaultPassword,
        });

        // Act
        configureBundle(staticFixtures.firstConfiguration);
        configureBundle(staticFixtures.secondConfiguration);
        cartPage.visit();
        cartPage.changeConfiguredBundleQuantity({ bundleName: staticFixtures.templateName, quantity: 2 });

        // Assert
        cartPage.getConfiguredBundles().should('have.length', 2);

        // Act
        checkoutScenario.execute({
          idCustomerAddress: dynamicFixtures.customer.addresses.addresses[0].id_customer_address,
          paymentMethod: getPaymentMethodBasedOnEnv(),
          shouldTriggerOmsInCli: true,
        });
        customerOverviewPage.viewLastPlacedOrder();

        // Assert
        orderDetailsPage
          .getOrderDetailTableBlock()
          .find('article')
          .filter(`:contains("${staticFixtures.templateName}")`)
          .should('have.length', 3);
      }
    );

    function configureBundle(slotSelections: BundleSlotSelection[]): void {
      bundleConfiguratorPage.visit();
      bundleConfiguratorPage.chooseTemplate(staticFixtures.templateName);

      slotSelections.forEach((slotSelection) => bundleConfiguratorPage.selectSlotProduct(slotSelection));

      bundleConfiguratorPage.goToSummary();
      bundleConfiguratorPage.addConfiguredBundleToCart();
    }

    function shopsWithBundleTemplatesIt(description: string, testFn: () => void): void {
      (['suite', 'b2b', 'b2c'].includes(Cypress.env('repositoryId')) ? it : it.skip)(description, testFn);
    }
  }
);
