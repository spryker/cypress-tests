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
import { CustomerLoginScenario, PlaceOrderScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';

// The group and option the configurator is driven to. Option one of each group is preselected, so
// picking the second is what makes the saved configuration differ from the default.
const CONFIGURED_GROUP_NUMBER = 1;

const CONFIGURED_OPTION_NUMBER = 2;

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
    const placeOrderScenario = container.get(PlaceOrderScenario);

    let staticFixtures: ConfigurableProductOmsStaticFixtures;
    let dynamicFixtures: ConfigurableProductOmsDynamicFixtures;
    let configuredOptionTitle: string;
    let orderReference: string;

    // The order item has to carry a configuration the customer saved, and no fixture helper persists
    // one onto a sales order item, so the order is placed through the storefront once for both tests.
    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
      productPage.reloadUntilConfigurable();

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

      placeOrderScenario
        .execute({
          idCustomerAddress: dynamicFixtures.address.id_customer_address,
          paymentMethod: getPaymentMethodBasedOnEnv(),
          shouldTriggerOmsInCli: true,
        })
        .then((placedOrderReference: string): void => {
          orderReference = placedOrderReference;
        });
    });

    it('given an order of a configured product when the back office drives it to shipped then the order item keeps the configuration', (): void => {
      // Arrange
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      salesIndexPage.visit();
      salesIndexPage.viewByReference(orderReference);

      salesDetailPage.getOrderItemTables().should((tables: JQuery<HTMLElement>): void => {
        expect(tables.text()).to.contain(configuredOptionTitle);
      });

      // Act
      salesDetailPage.triggerOms({ state: 'skip grace period', shouldTriggerOmsInCli: true });
      salesDetailPage.triggerOms({ state: 'Pay', shouldTriggerOmsInCli: true });
      salesDetailPage.triggerOms({ state: 'Skip timeout', shouldTriggerOmsInCli: true });
      salesDetailPage.triggerOms({ state: 'skip picking' });
      salesDetailPage.triggerOms({ state: 'Ship' });

      // Assert
      salesDetailPage.getOrderItemTables().should((tables: JQuery<HTMLElement>): void => {
        expect(tables.text()).to.contain(configuredOptionTitle);
      });
    });

    it('given an order of a configured product when the customer reorders it then the product is back in the cart without its configuration', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      customerOverviewPage.viewLastPlacedOrder();

      // Act
      // Reordering copies the item back into the cart, but a configuration belongs to the order it
      // was made for, so the customer has to configure the product again before checking out.
      orderDetailsPage.reorderAll();

      // Assert
      cartPage.assertPageLocation();
      cartPage.getBody().should('contain', dynamicFixtures.product.sku);
      cartPage.getBody().should('contain', staticFixtures.configurationNotCompleteStatus);
    });
  }
);
