import { container } from '@utils';
import {DummyPaymentOmsFlowDynamicFixtures, DummyPaymentOmsFlowStaticFixtures} from '@interfaces/backoffice';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CatalogPage, CustomerOverviewPage, ProductPage } from '@pages/yves';
import {
  CreateStoreScenario,
  EnableProductForAllStoresScenario,
  EnableWarehouseForAllStoresScenario,
  UserLoginScenario,
  EnableCmsBlockForAllStoresScenario,
  EnableAllPaymentMethodsForAllStoresScenario,
  EnableAllShipmentMethodsForAllStoresScenario,
    EnsureCatalogVisibilityScenario
} from '@scenarios/backoffice';
import { CheckoutScenario, CustomerLoginScenario, SelectStoreScenario } from '@scenarios/yves';

(Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)(
  'dummy payment OMS flow dms',
  { tags: '@dms' },
  () => {
    (['b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
      'dummy payment OMS flow',
      { tags: ['@backoffice'] },
      (): void => {
        const catalogPage = container.get(CatalogPage);
        const productsPage = container.get(ProductPage);
        const customerOverviewPage = container.get(CustomerOverviewPage);
        const salesIndexPage = container.get(SalesIndexPage);
        const salesDetailPage = container.get(SalesDetailPage);
        const loginCustomerScenario = container.get(CustomerLoginScenario);
        const checkoutScenario = container.get(CheckoutScenario);
        const userLoginScenario = container.get(UserLoginScenario);
        const createStoreScenario = container.get(CreateStoreScenario);
        const selectStoreScenario = container.get(SelectStoreScenario);
        const enableCmsBlockForAllStoresScenario = container.get(EnableCmsBlockForAllStoresScenario);
        const enableWarehouseForAllStoresScenario = container.get(EnableWarehouseForAllStoresScenario);
        const enableProductForAllStoresScenario = container.get(EnableProductForAllStoresScenario);
        const enableShipmentMethodForAllStoresScenario = container.get(EnableAllShipmentMethodsForAllStoresScenario);
        const enablePaymentMethodForAllStoresScenario = container.get(EnableAllPaymentMethodsForAllStoresScenario);
        const ensureCatalogVisibilityScenario = container.get(EnsureCatalogVisibilityScenario);

        let staticFixtures: DummyPaymentOmsFlowStaticFixtures;
        let dynamicFixtures: DummyPaymentOmsFlowDynamicFixtures;

        before((): void => {
            ({ staticFixtures, dynamicFixtures} = Cypress.env());

          userLoginScenario.execute({
            username: dynamicFixtures.rootUser.username,
            password: staticFixtures.defaultPassword,
          });

          createStoreScenario.execute({ store: staticFixtures.store });

          assignStoreRelationToExistingProduct();

          selectStoreScenario.execute(staticFixtures.store.name);
            ensureCatalogVisibilityScenario.execute();
        });

        skipB2BIt('backoffice operator should be able close an order from guest', (): void => {
          addOneProductToCart();
          checkoutScenario.execute({
            isGuest: true,
            paymentMethod: 'dummyPaymentCreditCard',
            shouldTriggerOmsInCli: true,
          });

          cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());

          userLoginScenario.execute({
            username: dynamicFixtures.rootUser.username,
            password: staticFixtures.defaultPassword,
          });

          salesIndexPage.visit();
          salesIndexPage.view();

          closeOrderFromBackoffice();
        });

        it('backoffice operator should be able close an order from customer', (): void => {
          loginCustomerScenario.execute({
            email: dynamicFixtures.customer.email,
            password: staticFixtures.defaultPassword,
          });

          selectStoreScenario.execute(staticFixtures.store.name);

          addOneProductToCart();

          checkoutScenario.execute({
            paymentMethod: staticFixtures.checkoutPaymentMethod
              ? staticFixtures.checkoutPaymentMethod
              : 'dummyPaymentCreditCard',
            shouldTriggerOmsInCli: true,
          });

          cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());

          userLoginScenario.execute({
            username: dynamicFixtures.rootUser.username,
            password: staticFixtures.defaultPassword,
          });

          salesIndexPage.visit();
          salesIndexPage.view();

          closeOrderFromBackoffice();
        });

        function addOneProductToCart(): void {
          catalogPage.visit();
          catalogPage.searchProductFromSuggestions({ query: staticFixtures.product.sku });
          productsPage.addToCart();
        }

        function closeOrderFromBackoffice(): void {
          salesDetailPage.triggerOms({ state: 'Pay', shouldTriggerOmsInCli: true });
          salesDetailPage.triggerOms({ state: 'Skip timeout' });
          salesDetailPage.triggerOms({ state: 'skip picking' });
          salesDetailPage.triggerOms({ state: 'Ship' });
          salesDetailPage.triggerOms({ state: 'Stock update' });
          salesDetailPage.triggerOms({ state: 'Close' });
        }

        function skipB2BIt(description: string, testFn: () => void): void {
          (Cypress.env('repositoryId') === 'b2b' ? it.skip : it)(description, testFn);
        }

        function assignStoreRelationToExistingProduct(): void {
          enableWarehouseForAllStoresScenario.execute({
            warehouse: staticFixtures.warehouse,
            storeName: staticFixtures.store.name,
          });

          enableProductForAllStoresScenario.execute({
            abstractProductSku: staticFixtures.product.abstract_sku,
            productPrice: staticFixtures.productPrice,
          });

          enableShipmentMethodForAllStoresScenario.execute({
            shipmentMethodKey: staticFixtures.shipmentMethod.key,
            shipmentMethod: staticFixtures.shipmentMethod.name,
            storeName: staticFixtures.store.name,
          });

          enablePaymentMethodForAllStoresScenario.execute({
            paymentMethodKey: staticFixtures.paymentMethod.key,
            paymentMethodName: staticFixtures.paymentMethod.name,
            storeName: staticFixtures.store.name,
          });

          staticFixtures.cmsBlockNames.forEach((cmsBlockName) => {
            enableCmsBlockForAllStoresScenario.execute({
              cmsBlockName: cmsBlockName,
              storeName: staticFixtures.store.name,
            });
          });
        }
      }
    );
  }
);
