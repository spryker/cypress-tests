import { container } from '@utils';
import { MarketplacePaymentOmsFlowStaticFixtures } from '@interfaces/smoke';
import { ActionEnum, SalesOrdersPage } from '@pages/mp';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import {
  CreateStoreScenario,
  EnableProductForAllStoresScenario,
  EnableWarehouseForAllStoresScenario,
  UserLoginScenario,
  EnableCmsBlockForAllStoresScenario,
  EnablePaymentMethodForAllStoresScenario,
  EnableShipmentMethodForAllStoresScenario,
  EnableMerchantForAllStoresScenario
} from '@scenarios/backoffice';
import { MerchantUserLoginScenario } from '@scenarios/mp';
import { CheckoutMpScenario, CustomerLoginScenario, SelectStoreScenario } from '@scenarios/yves';
import { CatalogPage, ProductPage } from '@pages/yves';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */

(Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)('health check dms', { tags: '@dms' }, () => {
    (['b2c', 'b2b'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
        'marketplace payment OMS flow',
        {tags: ['@smoke']},
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
            const enableShipmentMethodForAllStoresScenario = container.get(EnableShipmentMethodForAllStoresScenario);
            const enablePaymentMethodForAllStoresScenario = container.get(EnablePaymentMethodForAllStoresScenario);
            const enableMerchantForAllStoresScenario = container.get(EnableMerchantForAllStoresScenario);

            let staticFixtures: MarketplacePaymentOmsFlowStaticFixtures;

            before((): void => {
                staticFixtures = Cypress.env('staticFixtures');

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

                    cy.request({
                        method: 'POST',
                        url: Cypress.env().glueBackendUrl + '/token',
                        headers: {
                            Store: staticFixtures.store.name,
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: `grantType=password&username=${staticFixtures.rootUser.username}&password=${staticFixtures.defaultPassword}`,
                    })
                        .then((response) => {
                            expect(response.status).to.eq(200);
                            const authToken = response.body.access_token;
                            cy.wrap(authToken).as('authToken');

                            cy.request({
                                method: 'GET',
                                url: Cypress.env().glueBackendUrl + '/shipment-types',
                                headers: {
                                    Authorization: `Bearer ${authToken}`,
                                    'Content-Type': 'application/vnd.api+json',
                                },
                            })
                                .then((response) => {
                                    const deliveryIds = response.body.data
                                        .filter((item: any) => item.attributes.name.includes('Delivery'))
                                        .map((item: any) => item.id);
                                    cy.wrap(deliveryIds).as('deliveryIds');
                                });

                            cy.request({
                                method: 'GET',
                                url: Cypress.env().backofficeUrl + '/store-gui/list/table',
                            }).then((response) => {
                                const storeNames = response.body.data.map((store: any) => store[1]);
                                cy.wrap(storeNames).as('storeNames');
                            });

                            cy.get('@deliveryIds').then((deliveryIds: any) => {
                                cy.get('@storeNames').then((storeNames: string[]) => {
                                    deliveryIds.forEach((deliveryId: any) => {
                                        cy.request({
                                            method: 'PATCH',
                                            url: `${Cypress.env().glueBackendUrl}/shipment-types/${deliveryId}`,
                                            headers: {
                                                Authorization: `Bearer ${authToken}`,
                                                'Content-Type': 'application/vnd.api+json',
                                            },
                                            body: {
                                                data: {
                                                    type: 'shipment-types',
                                                    attributes: {
                                                        stores: storeNames
                                                    }
                                                }
                                            }
                                        }).then((patchResponse) => {
                                            expect(patchResponse.status).to.eq(200);
                                        });
                                    });
                                });
                            });
                        });
                }
            });

            skipB2BIt('merchant user should be able close an order from guest', (): void => {
                addOneProductToCart();
                checkoutMpScenario.execute({isGuest: true});

                userLoginScenario.execute({
                    username: staticFixtures.rootUser.username,
                    password: staticFixtures.defaultPassword,
                });

                assertMarketplacePaymentOmsTransitions();
            });

            it('merchant user should be able close an order from customer', (): void => {
                selectStoreScenario.execute(staticFixtures.store.name);

                customerLoginScenario.execute({
                    email: staticFixtures.customer.email,
                    password: staticFixtures.defaultPassword,
                });

                addOneProductToCart();
                checkoutMpScenario.execute();

                userLoginScenario.execute({
                    username: staticFixtures.rootUser.username,
                    password: staticFixtures.defaultPassword,
                });

                assertMarketplacePaymentOmsTransitions();
            });

            function assignStoreRelationToExistingProduct(): void {
                enableWarehouseForAllStoresScenario.execute({warehouse: staticFixtures.warehouse1});
                enableWarehouseForAllStoresScenario.execute({warehouse: staticFixtures.warehouse2});
                //
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

                enableMerchantForAllStoresScenario.execute({
                    merchantName: staticFixtures.merchantName1,
                });
                enableMerchantForAllStoresScenario.execute({
                    merchantName: staticFixtures.merchantName2,
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

            function addOneProductToCart(): void {
                catalogPage.visit();
                catalogPage.searchProductFromSuggestions({query: staticFixtures.product.sku});

                productsPage.addToCart({quantity: 4});
            }

            function assertMarketplacePaymentOmsTransitions(): void {
                salesIndexPage.visit();
                salesIndexPage.view();

                salesIndexPage.getOrderReference().then((orderReference) => {
                    salesDetailPage.triggerOms({state: 'Pay'});
                    salesDetailPage.triggerOms({state: 'skip picking'});

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

                salesDetailPage.triggerOms({state: 'Close'});
            }

            function closeOrderFromMerchantPortal(orderReference: string): void {
                if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
                    checkOrderVisibility(orderReference);
                }

                salesOrdersPage.visit();
                salesOrdersPage.update({query: orderReference, action: ActionEnum.sendToDistribution});

                salesOrdersPage.visit();
                salesOrdersPage.update({query: orderReference, action: ActionEnum.confirmAtCenter});

                salesOrdersPage.visit();
                salesOrdersPage.update({query: orderReference, action: ActionEnum.ship});

                salesOrdersPage.visit();
                salesOrdersPage.update({query: orderReference, action: ActionEnum.deliver});
            }

            function skipB2BIt(description: string, testFn: () => void): void {
                (['b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
            }
            function checkOrderVisibility(orderReference: string, attempts: number = 0, maxAttempts: number = 5): void {
                salesOrdersPage.visit();
                salesOrdersPage.hasOrderByOrderReference(orderReference).then((isVisible) => {
                    if (isVisible) {
                        return;
                    }

                    if (attempts < maxAttempts) {
                        cy.wait(10000);
                        checkOrderVisibility(orderReference, attempts + 1, maxAttempts);
                    }

                    throw new Error(`Order with reference ${orderReference} is not visible after maximum attempts`);
                });
            }
        }
    );
})
