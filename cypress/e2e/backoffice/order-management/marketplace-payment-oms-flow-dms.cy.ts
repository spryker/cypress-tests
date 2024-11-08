import { container } from '@utils';
import { MarketplacePaymentOmsFlowStaticFixtures } from '@interfaces/backoffice';
import { ActionEnum, SalesOrdersPage } from '@pages/mp';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import {
  CreateStoreScenario,
  EnableProductForAllStoresScenario,
  EnableWarehouseForAllStoresScenario,
  UserLoginScenario,
  EnableCmsBlockForAllStoresScenario,
  EnableAllPaymentMethodsForAllStoresScenario,
  EnableAllShipmentMethodsForAllStoresScenario,
  EnableMerchantForAllStoresScenario,
  EnableShipmentTypeForAllStoresScenario,
} from '@scenarios/backoffice';
import { MerchantUserLoginScenario } from '@scenarios/mp';
import { CheckoutMpScenario, CustomerLoginScenario, SelectStoreScenario } from '@scenarios/yves';
import { CatalogPage, ProductPage } from '@pages/yves';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */

(Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)(
  'marketplace payment OMS flow dms',
  { tags: '@dms' },
  () => {
    (['b2c', 'b2b'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
      'marketplace payment OMS flow',
      { tags: ['@smoke'] },
      (): void => {
        const catalogPage = container.get(CatalogPage);
        const productsPage = container.get(ProductPage);
        const salesIndexPage = container.get(SalesIndexPage);
        const salesDetailPage = container.get(SalesDetailPage);
        const salesOrdersPage = container.get(SalesOrdersPage);
        const userLoginScenario = container.get(UserLoginScenario);
        const customerLoginScenario = container.get(CustomerLoginScenario);
        const checkoutMpScenario = container.get(CheckoutMpScenario);
        const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);
        const createStoreScenario = container.get(CreateStoreScenario);
        const selectStoreScenario = container.get(SelectStoreScenario);
        const enableCmsBlockForAllStoresScenario = container.get(EnableCmsBlockForAllStoresScenario);
        const enableWarehouseForAllStoresScenario = container.get(EnableWarehouseForAllStoresScenario);
        const enableProductForAllStoresScenario = container.get(EnableProductForAllStoresScenario);
        const enableShipmentMethodForAllStoresScenario = container.get(EnableAllShipmentMethodsForAllStoresScenario);
        const enablePaymentMethodForAllStoresScenario = container.get(EnableAllPaymentMethodsForAllStoresScenario);
        const enableMerchantForAllStoresScenario = container.get(EnableMerchantForAllStoresScenario);
        const enableShipmentTypeForAllStoresScenario = container.get(EnableShipmentTypeForAllStoresScenario);

        let staticFixtures: MarketplacePaymentOmsFlowStaticFixtures;

        before((): void => {
          ({ staticFixtures } = Cypress.env());

          userLoginScenario.execute({
            username: staticFixtures.rootUser.username,
            password: staticFixtures.defaultPassword,
          });

          createStoreScenario.execute({
            store: staticFixtures.store,
          });

          assignStoreRelationToExistingProduct();

          selectStoreScenario.execute(staticFixtures.store.name);
          ensureCatalogVisibility();

          if (!['b2c', 'b2b', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
            enableShipmentTypeForAllStoresScenario.execute({
              store: staticFixtures.store.name,
              username: staticFixtures.rootUser.username,
              password: staticFixtures.defaultPassword,
            });
          }
        });

        skipB2BIt('merchant user should be able close an order from guest', (): void => {
          addOneProductToCart();
          checkoutMpScenario.execute({ isGuest: true, shouldTriggerOmsInCli: true });

          userLoginScenario.execute({
            username: staticFixtures.rootUser.username,
            password: staticFixtures.defaultPassword,
          });

          assertMarketplacePaymentOmsTransitions();
        });

        it('merchant user should be able close an order from customer', (): void => {
          customerLoginScenario.execute({
            email: staticFixtures.customer.email,
            password: staticFixtures.defaultPassword,
          });

          selectStoreScenario.execute(staticFixtures.store.name);

          addOneProductToCart();
          checkoutMpScenario.execute({ shouldTriggerOmsInCli: true });

          userLoginScenario.execute({
            username: staticFixtures.rootUser.username,
            password: staticFixtures.defaultPassword,
          });

          assertMarketplacePaymentOmsTransitions();
        });

        function assignStoreRelationToExistingProduct(): void {
          enableWarehouseForAllStoresScenario.execute({
            warehouse: staticFixtures.warehouse1,
            storeName: staticFixtures.store.name,
          });

          enableProductForAllStoresScenario.execute({
            abstractProductSku: staticFixtures.product.abstract_sku,
            productPrice: staticFixtures.productPrice,
            storeName: staticFixtures.store.name,
          });

          enableShipmentMethodForAllStoresScenario.execute({
            shipmentMethod: staticFixtures.shipmentMethod.name,
            shipmentMethodKey: staticFixtures.shipmentMethod.key,
            storeName: staticFixtures.store.name,
          });

          enablePaymentMethodForAllStoresScenario.execute({
            paymentMethodName: staticFixtures.paymentMethod.name,
            paymentMethodKey: staticFixtures.paymentMethod.key,
            storeName: staticFixtures.store.name,
          });

          staticFixtures.cmsBlockNames.forEach((cmsBlockName: string) => {
            enableCmsBlockForAllStoresScenario.execute({
              cmsBlockName: cmsBlockName,
              storeName: staticFixtures.store.name,
            });
          });

          enableMerchantForAllStoresScenario.execute({
            merchantName: staticFixtures.merchantName1,
            storeName: staticFixtures.store.name,
          });
          enableMerchantForAllStoresScenario.execute({
            merchantName: staticFixtures.merchantName2,
            storeName: staticFixtures.store.name,
          });
        }

        function ensureCatalogVisibility(attempts: number = 0, maxAttempts: number = 5): void {
          catalogPage.visit();
          catalogPage.hasProductsInCatalog().then((isVisible) => {
            if (isVisible) {
              return;
            }

            if (attempts < maxAttempts) {
              // eslint-disable-next-line cypress/no-unnecessary-waiting
              cy.wait(3000);
              ensureCatalogVisibility(attempts + 1, maxAttempts);
            }

            throw new Error('Catalog is not visible after maximum attempts');
          });
        }

        function addOneProductToCart(): void {
          catalogPage.visit();
          catalogPage.searchProductFromSuggestions({ query: staticFixtures.product.sku });

          productsPage.addToCart({ quantity: 4 });
        }

        function assertMarketplacePaymentOmsTransitions(): void {
          salesIndexPage.visit();
          salesIndexPage.view();

          salesIndexPage.getOrderReference().then((orderReference) => {
            salesDetailPage.triggerOms({ state: 'Pay' });
              cy.runCliCommands(['console oms:check-condition']);

              salesDetailPage.triggerOms({ state: 'skip picking' });

            merchantUserLoginScenario.execute({
              username: staticFixtures.merchantUser.username,
              password: staticFixtures.defaultPassword,
            });

            closeOrderFromMerchantPortal(orderReference);
            closeOrderFromBackoffice();
          });
        }

        function closeOrderFromBackoffice(): void {
          userLoginScenario.execute({
            username: staticFixtures.rootUser.username,
            password: staticFixtures.defaultPassword,
          });

          salesIndexPage.visit();
          salesIndexPage.view();

          salesDetailPage.triggerOms({ state: 'Close' });
        }

        function closeOrderFromMerchantPortal(orderReference: string): void {
          if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
            checkOrderVisibility(orderReference);
          }

          salesOrdersPage.visit();
          salesOrdersPage.update({ query: orderReference, action: ActionEnum.sendToDistribution });

          salesOrdersPage.visit();
          salesOrdersPage.update({ query: orderReference, action: ActionEnum.confirmAtCenter });

          salesOrdersPage.visit();
          salesOrdersPage.update({ query: orderReference, action: ActionEnum.ship });

          salesOrdersPage.visit();
          salesOrdersPage.update({ query: orderReference, action: ActionEnum.deliver });
        }

            function skipB2BIt(description: string, testFn: () => void): void {
                (['b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
            }

            function checkOrderVisibility(orderReference: string): void {
                cy.runCliCommands(['console oms:check-condition', 'console oms:check-timeout']);
                salesOrdersPage.visit();

                salesOrdersPage.hasOrderByOrderReference(orderReference).then((isVisible) => {
                    if (isVisible) {
                        return;
                    }

                    throw new Error(`Order with reference ${orderReference} is not visible`);
                });
            }
        }
    );
  }
);
