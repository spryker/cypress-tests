import { container } from '@utils';
import { OrderCreationDmsDynamicFixtures, OrderCreationDmsStaticFixtures } from '@interfaces/mp';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CatalogPage, ProductPage } from '@pages/yves';
import {
  AssignStoreToDefaultShipmentMethodsScenario,
  AssignStoreToDefaultShipmentTypesScenario,
  AssignStoreToDefaultWarehouseScenario,
  AssignStoreToMerchantScenario,
  AssignStoreToPaymentMethodsScenario,
  AssignStoreToProductScenario,
  CreateStoreScenario,
  UserLoginScenario,
} from '@scenarios/backoffice';
import { CheckoutMpScenario, CustomerLoginScenario, SelectStoreScenario } from '@scenarios/yves';
import { ActionEnum, SalesOrdersPage } from '@pages/mp';
import { MerchantUserLoginScenario } from '@scenarios/mp';

describeDmsSuiteAndMp('order creation dms', { tags: ['@mp', '@marketplace-order-management', '@dms'] }, (): void => {
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
  const assignStoreToDefaultWarehouseScenario = container.get(AssignStoreToDefaultWarehouseScenario);
  const assignStoreToDefaultShipmentMethodsScenario = container.get(AssignStoreToDefaultShipmentMethodsScenario);
  const assignStoreToPaymentMethodsScenario = container.get(AssignStoreToPaymentMethodsScenario);
  const assignStoreToDefaultShipmentTypesScenario = container.get(AssignStoreToDefaultShipmentTypesScenario);
  const assignStoreToMerchantScenario = container.get(AssignStoreToMerchantScenario);
  const selectStoreScenario = container.get(SelectStoreScenario);

  let staticFixtures: OrderCreationDmsStaticFixtures;
  let dynamicFixtures: OrderCreationDmsDynamicFixtures;

  before((): void => {
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

  it('merchant user should be able close an order from guest', (): void => {
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
      salesDetailPage.triggerOms({ state: 'Pay', shouldTriggerOmsInCli: true });
      salesDetailPage.triggerOms({ state: 'skip picking', shouldTriggerOmsInCli: true });

      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      closeOrderFromMerchantPortal(orderReference);
      closeOrderFromBackoffice();
    });
  }

  function closeOrderFromMerchantPortal(orderReference: string): void {
    if (!['b2b-mp', 'suite'].includes(Cypress.env('repositoryId'))) {
      salesOrdersPage.visit();
      salesOrdersPage.update({ query: orderReference, action: ActionEnum.sendToDistribution });

      salesOrdersPage.visit();
      salesOrdersPage.update({ query: orderReference, action: ActionEnum.confirmAtCenter });
    }

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
    assignStoreToDefaultWarehouseScenario.execute({
      storeName: staticFixtures.store.name,
      shouldTriggerPublishAndSync: true,
    });
    assignStoreToDefaultShipmentMethodsScenario.execute({
      storeName: staticFixtures.store.name,
      shouldTriggerPublishAndSync: true,
    });
    assignStoreToPaymentMethodsScenario.execute({
      storeName: staticFixtures.store.name,
      shouldTriggerPublishAndSync: true,
      paymentMethods: staticFixtures.paymentMethods,
    });

    if (['suite', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      assignStoreToDefaultShipmentTypesScenario.execute({
        store: staticFixtures.store.name,
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    }
  }
});

function describeDmsSuiteAndMp(title: string, options: { tags: string[] }, fn: () => void): void {
  (Cypress.env('isDynamicStoreEnabled') && ['suite', 'b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))
    ? describe
    : describe.skip)(title, fn);
}
