import { container } from '@utils';
import {
  CreateStoreScenario,
  EnableProductForAllStoresScenario,
  EnableWarehouseForAllStoresScenario,
  CreateProductScenario,
  UserLoginScenario,
} from '@scenarios/backoffice';
import { CatalogPage, ProductPage } from '@pages/yves';
import { PublishAndSynchronizeDmsStaticFixtures } from '@interfaces/yves';
import { PublishAndSynchronizeDmsDynamicFixtures } from '@interfaces/yves';
import { CustomerLoginScenario, SelectStoreScenario } from '@scenarios/yves';

(Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)(
  'publish and synchronize dms',
  { tags: '@dms, @product' },
  () => {
    describe('publish and synchronize', { tags: ['@backoffice'] }, (): void => {
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
      let dynamicFixtures: PublishAndSynchronizeDmsDynamicFixtures;
      let productAbstract: ProductAbstract;

      before((): void => {
        ({ staticFixtures, dynamicFixtures } = Cypress.env());

        userLoginScenario.execute({
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });
        createStoreScenario.execute({ store: staticFixtures.store });
      });

      beforeEach((): void => {
        userLoginScenario.execute({
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });

        productAbstract = createProductScenario.execute({ shouldTriggerPublishAndSync: true });
        assignStoreRelationToExistingProduct();
      });

      it('backoffice user should be able to create new product that will be available for guests in storefront', (): void => {
        selectStoreScenario.execute(staticFixtures.store.name);
        catalogPage.visit();

        catalogPage.search({ query: productAbstract.name });

        catalogPage.search({ query: productAbstract.name });

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
          email: dynamicFixtures.customer.email,
          password: staticFixtures.defaultPassword,
        });
        selectStoreScenario.execute(staticFixtures.store.name);

        catalogPage.visit();
        catalogPage.search({ query: productAbstract.name });

        catalogPage.search({ query: productAbstract.name });

        cy.contains(productAbstract.name);
        cy.contains(productAbstract.sku);
        cy.contains(productAbstract.description);
        cy.contains(productAbstract.price);

        productPage.addToCart();
        cy.contains(productPage.getAddToCartSuccessMessage());
      });

      function assignStoreRelationToExistingProduct(): void {
        enableWarehouseForAllStoresScenario.execute({
          warehouseName: staticFixtures.warehouse1,
          storeName: staticFixtures.store.name,
        });

        enableWarehouseForAllStoresScenario.execute({
          warehouseName: staticFixtures.warehouse2,
          storeName: staticFixtures.store.name,
        });

        enableProductForAllStoresScenario.execute({
          abstractProductSku: productAbstract.sku,
          productPrice: productAbstract.price,
          storeName: staticFixtures.store.name,
        });
      }
    });

    interface ProductAbstract {
      name: string;
      sku: string;
      price: string;
      description: string;
    }
  }
);
