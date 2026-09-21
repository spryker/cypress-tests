import { container } from '@utils';
import { OrderFulfilmentDynamicFixtures, OrderFulfilmentStaticFixtures } from '@interfaces/mp';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CatalogPage, ProductPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CheckoutMpScenario, CustomerLoginScenario } from '@scenarios/yves';
import { ActionEnum, SalesOrdersPage } from '@pages/mp';
import { MerchantUserLoginScenario } from '@scenarios/mp';

describe(
  'order fulfilment',
  {
    tags: [
      '@mp',
      '@marketplace-order-management',
      'marketplace-order-management',
      'order-management',
      'state-machine',
      'checkout',
      'cart',
      'marketplace-merchantportal-core',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because merchant orders exist only in suite, b2b-mp and b2c-mp', () => {});

      return;
    }

    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const salesOrdersPage = container.get(SalesOrdersPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const checkoutMpScenario = container.get(CheckoutMpScenario);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);

    let staticFixtures: OrderFulfilmentStaticFixtures;
    let dynamicFixtures: OrderFulfilmentDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it("given an order with two of a merchant's items when the merchant ships it and delivers one item then each item carries its own state", (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      [dynamicFixtures.merchantProduct.sku, dynamicFixtures.merchantProduct2.sku].forEach((sku) => {
        catalogPage.visit();
        catalogPage.searchProductFromSuggestions({ query: sku });
        productPage.addToCart();
      });

      // Each item gets its own shipment, which is what puts them in the merchant's order as
      // separate lines it can move one at a time.
      checkoutMpScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        isMultiShipment: true,
        shouldTriggerOmsInCli: true,
      });

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesIndexPage.visit();
      salesIndexPage.view();

      salesIndexPage.getOrderReference().then((orderReference) => {
        salesDetailPage.triggerOms({ state: 'skip grace period', shouldTriggerOmsInCli: true });
        salesDetailPage.triggerOms({ state: 'Pay', shouldTriggerOmsInCli: true });
        salesDetailPage.triggerOms({ state: 'skip picking', shouldTriggerOmsInCli: true });

        merchantUserLoginScenario.execute({
          username: dynamicFixtures.merchantUser.username,
          password: staticFixtures.defaultPassword,
        });

        // Act
        salesOrdersPage.visit();
        salesOrdersPage.update({ query: orderReference, action: ActionEnum.ship });

        // Act
        // One item is moved on its own from the items tab, which is what proves the merchant can
        // fulfil an order line by line rather than only as a whole.
        salesOrdersPage.visit();
        salesOrdersPage.openOrder({ query: orderReference });
        salesOrdersPage.openItemsTab();
        salesOrdersPage.changeOrderItemState({
          sku: dynamicFixtures.merchantProduct.sku,
          state: DELIVER_ORDER_ITEM_STATE,
        });

        // Assert
        salesOrdersPage.visit();
        salesOrdersPage.openOrder({ query: orderReference });
        salesOrdersPage.openItemsTab();
        salesOrdersPage
          .getOrderItemState({ sku: dynamicFixtures.merchantProduct.sku })
          .should('contain.text', staticFixtures.orderItemStates.delivered);
        salesOrdersPage
          .getOrderItemState({ sku: dynamicFixtures.merchantProduct2.sku })
          .should('contain.text', staticFixtures.orderItemStates.shipped);

        // Act
        salesOrdersPage.visit();
        salesOrdersPage.update({ query: orderReference, action: ActionEnum.deliver });

        // Assert
        salesOrdersPage.visit();
        salesOrdersPage.openOrder({ query: orderReference });
        salesOrdersPage.openItemsTab();
        salesOrdersPage
          .getOrderItemState({ sku: dynamicFixtures.merchantProduct2.sku })
          .should('contain.text', staticFixtures.orderItemStates.delivered);
      });
    });
  }
);

const DELIVER_ORDER_ITEM_STATE = 'Deliver';
