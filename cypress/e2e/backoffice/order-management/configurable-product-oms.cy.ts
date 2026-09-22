import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { ConfigurableProductOmsDynamicFixtures, ConfigurableProductOmsStaticFixtures } from '@interfaces/backoffice';
import {
  CartPage,
  CatalogPage,
  CustomerOverviewPage,
  OrderDetailsPage,
  ProductConfiguratorPage,
  ProductPage,
} from '@pages/yves';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';

// The group and option the configurator is driven to. Option one of each group is preselected, so
// picking the second is what makes the saved configuration differ from the default.
const CONFIGURED_GROUP_NUMBER = 1;

const CONFIGURED_OPTION_NUMBER = 2;

const CONFIGURE_BUTTON_SELECTOR = '[data-qa="component configuration-form"] button';

const PUBLISH_RELOAD_ATTEMPTS = 20;

const PUBLISH_RELOAD_INTERVAL_MS = 3000;

describe(
  'configurable product OMS',
  {
    tags: [
      '@backoffice',
      '@order-management',
      'order-management',
      'marketplace-order-management',
      'configurable-product',
      'product',
      'state-machine',
      'cart',
      'checkout',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const productConfiguratorPage = container.get(ProductConfiguratorPage);
    const cartPage = container.get(CartPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const orderDetailsPage = container.get(OrderDetailsPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);

    let staticFixtures: ConfigurableProductOmsStaticFixtures;
    let dynamicFixtures: ConfigurableProductOmsDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a configured product ordered and shipped when the order is reordered then the configuration is on the order but not in the new cart', (): void => {
      // Arrange
      let configuredOptionTitle: string;

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      openProductDetailPage();
      productPage.getProductConfigurationStatus().should('contain', staticFixtures.configurationNotCompleteStatus);

      productPage.configure();
      productConfiguratorPage.getHeading().should('be.visible');
      productConfiguratorPage
        .getOptionTitle(CONFIGURED_GROUP_NUMBER, CONFIGURED_OPTION_NUMBER)
        .then((title: string): void => {
          configuredOptionTitle = title;
        });
      productConfiguratorPage.selectOption(CONFIGURED_GROUP_NUMBER, CONFIGURED_OPTION_NUMBER);
      productConfiguratorPage.save();

      productPage.getProductConfigurationStatus().should('contain', staticFixtures.configurationCompleteStatus);
      productPage.addToCart();

      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        paymentMethod: getPaymentMethodBasedOnEnv(),
        shouldTriggerOmsInCli: true,
      });

      // Act
      openOrderInBackoffice();

      // Assert
      // The configuration the customer saved is carried onto the order item, and stays there while
      // the order walks the state machine.
      salesDetailPage.getOrderItemTables().should((tables: JQuery<HTMLElement>): void => {
        expect(tables.text()).to.contain(configuredOptionTitle);
      });

      // Act
      driveOrderToShipped();

      // Assert
      salesDetailPage.getOrderItemTables().should((tables: JQuery<HTMLElement>): void => {
        expect(tables.text()).to.contain(configuredOptionTitle);
      });

      // Act
      // Reordering copies the item back into the cart, but a configuration belongs to the order it
      // was made for, so the customer has to configure the product again before checking out.
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      customerOverviewPage.viewLastPlacedOrder();
      orderDetailsPage.reorderAll();

      // Assert
      cartPage.assertPageLocation();
      cartPage.getBody().should('contain', dynamicFixtures.product.sku);
      cartPage.getBody().should('contain', staticFixtures.configurationNotCompleteStatus);
    });

    // A freshly created product's data can still be propagating to storage right after fixture
    // setup, and until the configuration lands the PDP renders no configure button at all.
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

    function openOrderInBackoffice(): void {
      customerOverviewPage.viewLastPlacedOrder();
      orderDetailsPage.getOrderReferenceBlock().then((orderReference: string) => {
        userLoginScenario.execute({
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });

        salesIndexPage.visit();
        salesIndexPage.viewByReference(orderReference.trim());
      });
    }

    function driveOrderToShipped(): void {
      salesDetailPage.triggerOms({ state: 'skip grace period', shouldTriggerOmsInCli: true });
      salesDetailPage.triggerOms({ state: 'Pay', shouldTriggerOmsInCli: true });
      salesDetailPage.triggerOms({ state: 'Skip timeout', shouldTriggerOmsInCli: true });
      salesDetailPage.triggerOms({ state: 'skip picking' });
      salesDetailPage.triggerOms({ state: 'Ship' });
    }
  }
);
