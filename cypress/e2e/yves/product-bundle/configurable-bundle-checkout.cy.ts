import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { ConfigurableBundleCheckoutDynamicFixtures, ConfigurableBundleCheckoutStaticFixtures } from '@interfaces/yves';
import { CartPage, CustomerOverviewPage, OrderDetailsPage } from '@pages/yves';
import { CheckoutScenario, ConfigureBundleScenario, CustomerLoginScenario } from '@scenarios/yves';

describe(
  'configurable bundle checkout',
  {
    tags: ['@yves', '@merchandising', 'configurable-bundle', 'product', 'cart', 'checkout', 'spryker-core'],
  },
  (): void => {
    const cartPage = container.get(CartPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const orderDetailsPage = container.get(OrderDetailsPage);
    const checkoutScenario = container.get(CheckoutScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const configureBundleScenario = container.get(ConfigureBundleScenario);

    let staticFixtures: ConfigurableBundleCheckoutStaticFixtures;
    let dynamicFixtures: ConfigurableBundleCheckoutDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    // The bundle templates and the products their slots offer are demo data, and only the suite,
    // b2b and b2c shops ship them - the two marketplace shops carry no clone of this journey either.
    // The b2b id also runs against the marketplace B2B shop, the only one built with SSP enabled,
    // whose demo data deactivates this template.
    (['suite', 'b2b', 'b2c'].includes(Cypress.env('repositoryId')) &&
      !(Cypress.env('repositoryId') === 'b2b' && Cypress.env('ENV_IS_SSP_ENABLED'))
      ? it
      : it.skip)(
      'given two configurations of one bundle template when one of them is doubled in the cart and the order is placed then the order carries three bundles',
      (): void => {
        // Arrange
        customerLoginScenario.execute({
          email: dynamicFixtures.customer.email,
          password: staticFixtures.defaultPassword,
        });

        // Act
        configureBundleScenario.execute({
          templateName: staticFixtures.templateName,
          slotSelections: staticFixtures.firstConfiguration,
        });
        configureBundleScenario.execute({
          templateName: staticFixtures.templateName,
          slotSelections: staticFixtures.secondConfiguration,
        });
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
  }
);
