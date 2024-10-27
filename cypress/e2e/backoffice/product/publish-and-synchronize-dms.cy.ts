import { container } from '@utils';
import {
    CreateStoreScenario,
    EnableProductForAllStoresScenario,
    EnableWarehouseForAllStoresScenario,
    CreateProductScenario,
    UserLoginScenario,
} from '@scenarios/backoffice';
import { CatalogPage, ProductPage } from '@pages/yves';
import { PublishAndSynchronizeDmsStaticFixtures } from '@interfaces/smoke';
import { CustomerLoginScenario, SelectStoreScenario } from '@scenarios/yves';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */

(Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)('publish and synchronize dms', { tags: '@dms' }, () => {
    describe('publish and synchronize', {tags: ['@smoke']}, (): void => {
        const catalogPage = container.get(CatalogPage);
        const productPage = container.get(ProductPage);
        const userLoginScenario = container.get(UserLoginScenario);
        const createProductScenario = container.get(CreateProductScenario);
        const customerLoginScenario = container.get(CustomerLoginScenario);
        const createStoreScenario = container.get(CreateStoreScenario);
        const selectStoreScenario = container.get(SelectStoreScenario);
        const enableWarehouseForAllStoresScenario = container.get(EnableWarehouseForAllStoresScenario);
        const enableProductForAllStoresScenario = container.get(EnableProductForAllStoresScenario);

        let staticFixtures: PublishAndSynchronizeDmsStaticFixtures;
        let productAbstract: ProductAbstract;

        before((): void => {
            staticFixtures = Cypress.env('staticFixtures');

            userLoginScenario.execute({
                username: staticFixtures.rootUser.username,
                password: staticFixtures.defaultPassword,
            });
            createStoreScenario.execute({store: staticFixtures.store});
        });

        beforeEach((): void => {
            userLoginScenario.execute({
                username: staticFixtures.rootUser.username,
                password: staticFixtures.defaultPassword,
            });

            productAbstract = createProductScenario.execute({shouldTriggerPublishAndSync: true});
            assignStoreRelationToExistingProduct();
        });

        it('backoffice user should be able to create new product that will be available for guests in storefront', (): void => {
            selectStoreScenario.execute(staticFixtures.store.name);
            catalogPage.visit();
            selectStoreScenario.execute(staticFixtures.store.name);

            catalogPage.search({query: productAbstract.name});

            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(5000); // For some reason URL still not synced in Redis, and after search, we need to wait a bit
            catalogPage.search({query: productAbstract.name});

            cy.contains(productAbstract.name);
            cy.contains(productAbstract.sku);
            cy.contains(productAbstract.description);

            if (!['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
                cy.contains(productAbstract.price);
                productPage.addToCart();
                cy.contains(productPage.getAddToCartSuccessMessage());
            }
        });

        it('backoffice user should be able to create new product that will be available for customers in storefront', (): void => {
            customerLoginScenario.execute({
                email: staticFixtures.customer.email,
                password: staticFixtures.defaultPassword,
            });
            selectStoreScenario.execute(staticFixtures.store.name);

            catalogPage.visit();
            catalogPage.search({query: productAbstract.name});

            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(5000); // For some reason URL still not synced in Redis, and after search, we need to wait a bit
            catalogPage.search({query: productAbstract.name});

            cy.contains(productAbstract.name);
            cy.contains(productAbstract.sku);
            cy.contains(productAbstract.description);
            cy.contains(productAbstract.price);

            productPage.addToCart();
            cy.contains(productPage.getAddToCartSuccessMessage());
        });

        function assignStoreRelationToExistingProduct(): void {
            enableWarehouseForAllStoresScenario.execute({warehouse: staticFixtures.warehouse1});
            enableWarehouseForAllStoresScenario.execute({warehouse: staticFixtures.warehouse2});

            enableProductForAllStoresScenario.execute({
                abstractProductSku: staticFixtures.product.abstract_sku,
                productPrice: staticFixtures.productPrice,
            });
        }
    });

    interface ProductAbstract {
        name: string;
        sku: string;
        price: string;
        description: string;
    }
})
