import { container } from '@utils';
import { OrderCreationDmsDynamicFixtures, OrderCreationDmsStaticFixtures } from '@interfaces/mp';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CatalogPage, ProductPage } from '@pages/yves';
import {
  AssignStoreToMerchantScenario,
  AssignStoreToProductScenario,
  CreateStoreScenario,
  SetupDefaultStoreRelationsScenario,
  UserLoginScenario,
} from '@scenarios/backoffice';
import { CheckoutMpScenario, CustomerLoginScenario, SelectStoreScenario } from '@scenarios/yves';
import { ActionEnum, SalesOrdersPage } from '@pages/mp';
import { MerchantUserLoginScenario } from '@scenarios/mp';
import { retryableBefore } from '../../../support/e2e';

describe(
  'order creation dms',
  {
    tags: [
      '@mp',
      '@marketplace-order-management',
      '@dms',
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
    if (!Cypress.env('isDynamicStoreEnabled') || !['suite', 'b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for DMS on suite, b2b-mp and b2c-mp', () => {});
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
    const createStoreScenario = container.get(CreateStoreScenario);
    const assignStoreToProductScenario = container.get(AssignStoreToProductScenario);
    const setupDefaultStoreRelationsScenario = container.get(SetupDefaultStoreRelationsScenario);
    const assignStoreToMerchantScenario = container.get(AssignStoreToMerchantScenario);
    const selectStoreScenario = container.get(SelectStoreScenario);

    let staticFixtures: OrderCreationDmsStaticFixtures;
    let dynamicFixtures: OrderCreationDmsDynamicFixtures;

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      createStoreScenario.execute({ store: staticFixtures.store, shouldTriggerPublishAndSync: true });

      assignStoreToMerchant(dynamicFixtures.merchant.name);
      assignStoreToProduct(dynamicFixtures.merchantProduct.abstract_sku);
      setupDefaultStoreRelations();
    });

    beforeEach((): void => {
      selectStoreScenario.execute(staticFixtures.store.name);
    });

    skipB2BIt('merchant user should be able close an order from guest', (): void => {
      addOneProductToCart();
      checkoutMpScenario.execute({ isGuest: true, shouldTriggerOmsInCli: true });

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      assertMarketplacePaymentOmsTransitions();
    });

    it('merchant user should be able close an order from customer', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      selectStoreScenario.execute(staticFixtures.store.name);

      addOneProductToCart();
      checkoutMpScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        shouldTriggerOmsInCli: true,
      });

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      assertMarketplacePaymentOmsTransitions();
    });

    function addOneProductToCart(): void {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.merchantProduct.sku });
      productPage.addToCart();
    }

    function assertMarketplacePaymentOmsTransitions(): void {
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

        if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
          cy.runCliCommands(['vendor/bin/console oms:check-condition', 'vendor/bin/console oms:check-timeout']);
        }

        closeOrderFromMerchantPortal(orderReference);
        closeOrderFromBackoffice();
      });
    }

    function closeOrderFromMerchantPortal(orderReference: string): void {
      salesOrdersPage.visit();
      salesOrdersPage.update({ query: orderReference, action: ActionEnum.ship });

      salesOrdersPage.visit();
      salesOrdersPage.update({ query: orderReference, action: ActionEnum.deliver });
    }

    function closeOrderFromBackoffice(): void {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesIndexPage.visit();
      salesIndexPage.view();

      salesDetailPage.triggerOms({ state: 'Close' });
    }

    function assignStoreToMerchant(merchantName: string): void {
      assignStoreToMerchantScenario.execute({
        merchantName: merchantName,
        storeName: staticFixtures.store.name,
        shouldTriggerPublishAndSync: true,
      });
    }

    function assignStoreToProduct(abstractSku: string): void {
      assignStoreToProductScenario.execute({
        abstractProductSku: abstractSku,
        storeName: staticFixtures.store.name,
        shouldTriggerPublishAndSync: true,
      });
    }

    function setupDefaultStoreRelations(): void {
      setupDefaultStoreRelationsScenario.execute({
        storeName: staticFixtures.store.name,
        paymentMethods: staticFixtures.paymentMethods,
        rootUser: {
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        },
      });
    }

    function skipB2BIt(description: string, testFn: () => void): void {
      (['b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
    }
  }
);
