import { container } from '@utils';
import {BasicCheckoutDynamicFixtures, CheckoutStaticFixtures} from '@interfaces/yves';
import { CatalogPage, CustomerOverviewPage, ProductPage } from '@pages/yves';
import {CheckoutScenario, CustomerLoginScenario, SelectStoreScenario} from '@scenarios/yves';
import {
  CreateStoreScenario,
  EnableCmsBlockForAllStoresScenario, EnableAllPaymentMethodsForAllStoresScenario,
  EnableProductForAllStoresScenario,
  EnableAllShipmentMethodsForAllStoresScenario,
  EnableWarehouseForAllStoresScenario,
  UserLoginScenario
} from "@scenarios/backoffice";
import {faker} from "@faker-js/faker";

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */

(Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)('basic checkout dms', { tags: '@dms' }, () => {
    describe('basic checkout', {tags: ['@smoke']}, (): void => {
        const userLoginScenario = container.get(UserLoginScenario);
        const createStoreScenario = container.get(CreateStoreScenario);
        const selectStoreScenario = container.get(SelectStoreScenario);
        const catalogPage = container.get(CatalogPage);
        const productPage = container.get(ProductPage);
        const customerOverviewPage = container.get(CustomerOverviewPage);
        const loginCustomerScenario = container.get(CustomerLoginScenario);
        const checkoutScenario = container.get(CheckoutScenario);
        const enableWarehouseForAllStoresScenario = container.get(EnableWarehouseForAllStoresScenario);
        const enableProductForAllStoresScenario = container.get(EnableProductForAllStoresScenario);
        const enableShipmentMethodForAllStoresScenario = container.get(EnableAllShipmentMethodsForAllStoresScenario);
        const enablePaymentMethodForAllStoresScenario = container.get(EnableAllPaymentMethodsForAllStoresScenario);

        let staticFixtures: CheckoutStaticFixtures;
        let dynamicFixtures: BasicCheckoutDynamicFixtures;

        before((): void => {
            ({ staticFixtures, dynamicFixtures } = Cypress.env());

            userLoginScenario.execute({
                username: staticFixtures.rootUser.username,
                password: staticFixtures.defaultPassword,
            });

            createStoreScenario.execute({store: staticFixtures.store});

            assignStoreRelationToExistingProduct();
        });

        beforeEach((): void => {
            selectStoreScenario.execute(staticFixtures.store.name);
        });

        skipB2BIt('guest customer should checkout to single shipment', (): void => {
            addTwoProductsToCart();
            checkoutScenario.execute({isGuest: true, paymentMethod: getPaymentMethodBasedOnEnv()});

            cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
        });

        it.skip('guest customer should checkout to multi shipment address', (): void => {
            addTwoProductsToCart();

            checkoutScenario.execute({
                isGuest: true,
                isMultiShipment: true,
                paymentMethod: getPaymentMethodBasedOnEnv(),
            });

            cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
        });

        it('customer should checkout to single shipment (with new shipping address)', (): void => {
            loginCustomerScenario.execute({
                email: dynamicFixtures.customer.email,
                password: staticFixtures.defaultPassword,
            });

            addTwoProductsToCart();
            checkoutScenario.execute({paymentMethod: getPaymentMethodBasedOnEnv()});

            cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
        });

        it.skip('customer should checkout to multi shipment address (with new shipping address)', (): void => {
            loginCustomerScenario.execute({
                email: staticFixtures.customer.email,
                password: staticFixtures.defaultPassword,
            });

            addTwoProductsToCart();
            checkoutScenario.execute({isMultiShipment: true, paymentMethod: getPaymentMethodBasedOnEnv()});

            cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());
        });

        function skipB2BIt(description: string, testFn: () => void): void {
            (['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
        }

        function getPaymentMethodBasedOnEnv(): string {
            return ['b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))
                ? 'dummyMarketplacePaymentInvoice'
                : 'dummyPaymentInvoice';
        }

        function addTwoProductsToCart(): void {
            catalogPage.visit();
            catalogPage.searchProductFromSuggestions({query: staticFixtures.product1.sku});
            productPage.addToCart();

            catalogPage.visit();
            catalogPage.searchProductFromSuggestions({query: staticFixtures.product2.sku});
            productPage.addToCart();
        }

        function assignStoreRelationToExistingProduct(): void {
            enableWarehouseForAllStoresScenario.execute({warehouse: staticFixtures.warehouse});

            enableProductForAllStoresScenario.execute({
                abstractProductSku: staticFixtures.product1.abstract_sku,
                productPrice: staticFixtures.productPrice,
            });

            enableProductForAllStoresScenario.execute({
                abstractProductSku: staticFixtures.product2.abstract_sku,
                productPrice: staticFixtures.productPrice,
            });

            staticFixtures.shipmentMethods.forEach((shipmentMethod) =>
                enableShipmentMethodForAllStoresScenario.execute({
                    shipmentMethod: shipmentMethod,
                    storeName: staticFixtures.store.name,
                }));

            staticFixtures.paymentMethods.forEach((methodName) =>
                enablePaymentMethodForAllStoresScenario.execute({
                    paymentMethod: methodName,
                    storeName: staticFixtures.store.name,
                }));
        }
    });
})
