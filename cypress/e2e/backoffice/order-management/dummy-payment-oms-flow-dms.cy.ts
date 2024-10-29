import { container } from '@utils';
import { DummyPaymentOmsFlowStaticFixtures } from '@interfaces/smoke';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CatalogPage, CustomerOverviewPage, ProductPage } from '@pages/yves';
import {
  CreateStoreScenario,
  EnableProductForAllStoresScenario,
  EnableWarehouseForAllStoresScenario,
  UserLoginScenario,
  EnableCmsBlockForAllStoresScenario,
  EnablePaymentMethodForAllStoresScenario,
  EnableShipmentMethodForAllStoresScenario,
} from '@scenarios/backoffice';
import { CheckoutScenario, CustomerLoginScenario, SelectStoreScenario } from '@scenarios/yves';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */

(Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)('dummy payment OMS flow dms', { tags: '@dms' }, () => {
    (['b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
        'dummy payment OMS flow',
        {tags: ['@smoke']},
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
            const enableShipmentMethodForAllStoresScenario = container.get(EnableShipmentMethodForAllStoresScenario);
            const enablePaymentMethodForAllStoresScenario = container.get(EnablePaymentMethodForAllStoresScenario);

            let staticFixtures: DummyPaymentOmsFlowStaticFixtures;

            before((): void => {
                staticFixtures = Cypress.env('staticFixtures');

                userLoginScenario.execute({
                    username: staticFixtures.rootUser.username,
                    password: staticFixtures.defaultPassword,
                });

                createStoreScenario.execute({store: staticFixtures.store});

                assignStoreRelationToExistingProduct();

                selectStoreScenario.execute(staticFixtures.store.name);
                ensureCatalogVisibility();
            });

            skipB2BIt('backoffice operator should be able close an order from guest', (): void => {
                addOneProductToCart();
                checkoutScenario.execute({isGuest: true, paymentMethod: 'dummyPaymentCreditCard'});

                cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());

                userLoginScenario.execute({
                    username: staticFixtures.rootUser.username,
                    password: staticFixtures.defaultPassword,
                });

                salesIndexPage.visit();
                salesIndexPage.view();

                closeOrderFromBackoffice();
            });

            it('backoffice operator should be able close an order from customer', (): void => {
                loginCustomerScenario.execute({
                    email: staticFixtures.customer.email,
                    password: staticFixtures.defaultPassword,
                });

                selectStoreScenario.execute(staticFixtures.store.name);

                addOneProductToCart();

                checkoutScenario.execute({paymentMethod: staticFixtures.checkoutPaymentMethod ? staticFixtures.checkoutPaymentMethod : 'dummyPaymentCreditCard'});

                cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());

                userLoginScenario.execute({
                    username: staticFixtures.rootUser.username,
                    password: staticFixtures.defaultPassword,
                });

                salesIndexPage.visit();
                salesIndexPage.view();

                closeOrderFromBackoffice();
            });

            function addOneProductToCart(): void {
                catalogPage.visit();
                catalogPage.searchProductFromSuggestions({query: staticFixtures.product.sku});
                productsPage.addToCart();
            }

            function closeOrderFromBackoffice(): void {
                salesDetailPage.triggerOms({state: 'Pay'});
                cy.log('Pay is triggered');
                salesDetailPage.triggerOms({state: 'Skip timeout'});
                cy.log('Skip is triggered');
                salesDetailPage.triggerOms({state: 'skip picking'});
                cy.log('skip is triggered');
                salesDetailPage.triggerOms({state: 'Ship'});
                cy.log('Ship is triggered');
                salesDetailPage.triggerOms({state: 'Stock update'});
                cy.log('Stock is triggered');
                salesDetailPage.triggerOms({state: 'Close'});
                cy.log('Close is triggered');
            }

            function skipB2BIt(description: string, testFn: () => void): void {
                (Cypress.env('repositoryId') === 'b2b' ? it.skip : it)(description, testFn);
            }

            function assignStoreRelationToExistingProduct(): void {
                enableWarehouseForAllStoresScenario.execute({warehouse: staticFixtures.warehouse});

                enableProductForAllStoresScenario.execute({
                    abstractProductSku: staticFixtures.product.abstract_sku,
                    productPrice: staticFixtures.productPrice,
                });

                enableShipmentMethodForAllStoresScenario.execute({
                    shipmentMethod: staticFixtures.shipmentMethod,
                });

                enablePaymentMethodForAllStoresScenario.execute({
                    paymentMethod: staticFixtures.paymentMethod,
                });

                staticFixtures.cmsBlockNames.forEach((cmsBlockName) => {
                    enableCmsBlockForAllStoresScenario.execute({
                        cmsBlockName: cmsBlockName,
                    });
                });
            }

            function ensureCatalogVisibility(attempts: number = 0, maxAttempts: number = 5): void {
                catalogPage.visit();
                catalogPage.hasProductsInCatalog().then((isVisible) => {
                    if (isVisible) {
                        return;
                    }

                    if (attempts < maxAttempts) {
                        cy.wait(3000);
                        ensureCatalogVisibility(attempts + 1, maxAttempts);
                    }

                    throw new Error("Catalog is not visible after maximum attempts");
                });
            }
        }
    );
})
