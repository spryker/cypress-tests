import { container } from '@utils';
import { OrderCreationDmsDynamicFixtures, OrderManagementDmsStaticFixtures } from '@interfaces/backoffice';
import { CatalogPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario, SelectStoreScenario } from '@scenarios/yves';
import {
  CreateStoreScenario,
  UserLoginScenario,
  AssignStoreToProductScenario,
  EnableCmsBlockForAllStoresScenario,
  SetupDefaultStoreRelationsScenario,
} from '@scenarios/backoffice';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { retryableBefore } from '../../../support/e2e';

describeIfDynamicStoreEnabled(
  'order creation dms',
  { tags: ['@backoffice', '@order-management', '@dms'] },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);

    const checkoutScenario = container.get(CheckoutScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const selectStoreScenario = container.get(SelectStoreScenario);
    const createStoreScenario = container.get(CreateStoreScenario);
    const assignStoreToProductScenario = container.get(AssignStoreToProductScenario);
    const enableCmsBlockForAllStoresScenario = container.get(EnableCmsBlockForAllStoresScenario);
    const setupDefaultStoreRelationsScenario = container.get(SetupDefaultStoreRelationsScenario);

    let staticFixtures: OrderManagementDmsStaticFixtures;
    let dynamicFixtures: OrderCreationDmsDynamicFixtures;

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      createStoreScenario.execute({ store: staticFixtures.store, shouldTriggerPublishAndSync: true });

      assignStoreToProductScenario.execute({
        abstractProductSku: dynamicFixtures.product.abstract_sku,
        storeName: staticFixtures.store.name,
        shouldTriggerPublishAndSync: true,
      });

      setupDefaultStoreRelations();
      setupDefaultCmsBlockForStore();
    });

    beforeEach((): void => {
      selectStoreScenario.execute(staticFixtures.store.name);
    });

    skipB2BIt('backoffice user should be able close an order from guest', (): void => {
      addOneProductToCart();
      checkoutScenario.execute({ isGuest: true, shouldTriggerOmsInCli: true });

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      assertOmsTransitions();
    });

    it('backoffice user should be able close an order from customer', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      selectStoreScenario.execute(staticFixtures.store.name);

      addOneProductToCart();
      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        shouldTriggerOmsInCli: true,
      });

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      assertOmsTransitions();
    });

    function assertOmsTransitions(): void {
      salesIndexPage.visit();
      salesIndexPage.view();

        salesDetailPage.triggerOms({ state: 'skip grace period', shouldTriggerOmsInCli: true });
      salesDetailPage.triggerOms({ state: 'Pay', shouldTriggerOmsInCli: true });
      salesDetailPage.triggerOms({ state: 'Skip timeout', shouldTriggerOmsInCli: true });
      salesDetailPage.triggerOms({ state: 'skip picking' });
      salesDetailPage.triggerOms({ state: 'Ship' });
      salesDetailPage.triggerOms({ state: 'Stock update' });
      salesDetailPage.triggerOms({ state: 'Close' });
    }

    function addOneProductToCart(): void {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
      productPage.addToCart();
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

    function setupDefaultCmsBlockForStore(): void {
      enableCmsBlockForAllStoresScenario.execute({
        cmsBlockName: 'order-confirmation--text',
        storeName: staticFixtures.store.name,
        shouldTriggerPublishAndSync: true,
      });
      enableCmsBlockForAllStoresScenario.execute({
        cmsBlockName: 'order-confirmation--html',
        storeName: staticFixtures.store.name,
        shouldTriggerPublishAndSync: true,
      });
      enableCmsBlockForAllStoresScenario.execute({
        cmsBlockName: 'order-shipped--text',
        storeName: staticFixtures.store.name,
        shouldTriggerPublishAndSync: true,
      });
      enableCmsBlockForAllStoresScenario.execute({
        cmsBlockName: 'order-shipped--html',
        storeName: staticFixtures.store.name,
        shouldTriggerPublishAndSync: true,
      });
    }

    function skipB2BIt(description: string, testFn: () => void): void {
      (['b2b'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
    }
  }
);

function describeIfDynamicStoreEnabled(title: string, options: { tags: string[] }, fn: () => void): void {
  (Cypress.env('isDynamicStoreEnabled') && ['suite', 'b2c', 'b2b'].includes(Cypress.env('repositoryId'))
    ? describe
    : describe.skip)(title, fn);
}
