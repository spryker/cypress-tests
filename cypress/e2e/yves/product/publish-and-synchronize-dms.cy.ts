import { container } from '@utils';
import {
  AssignStoreToDefaultWarehouseScenario,
  CreateProductScenario,
  CreateStoreScenario,
  UserLoginScenario
} from '@scenarios/backoffice';
import { CatalogPage, ProductPage } from '@pages/yves';
import { PublishAndSynchronizeDmsDynamicFixtures, PublishAndSynchronizeDmsStaticFixtures } from '@interfaces/yves';
import { CustomerLoginScenario, SelectStoreScenario } from '@scenarios/yves';

describe(
  'publish and synchronize dms',
  {
    tags: [
      '@yves',
      '@product',
      '@dms',
      'product',
      'marketplace-product',
      'spryker-core-back-office',
      'inventory-management',
      'spryker-core',
      'search',
      'catalog',
      'prices',
      'cart',
    ],
  },
  (): void => {
    if (!Cypress.env('isDynamicStoreEnabled')) {
      it.skip('skipped due to disabled dynamic store feature', () => {});
      return;
    }
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const createProductScenario = container.get(CreateProductScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const createStoreScenario = container.get(CreateStoreScenario);
    const selectStoreScenario = container.get(SelectStoreScenario);
    const assignStoreToDefaultWarehouseScenario = container.get(AssignStoreToDefaultWarehouseScenario);

    let dynamicFixtures: PublishAndSynchronizeDmsDynamicFixtures;
    let staticFixtures: PublishAndSynchronizeDmsStaticFixtures;
    let productAbstract: ProductAbstract;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      createStoreScenario.execute({ store: staticFixtures.store, shouldTriggerPublishAndSync: true });
      assignStoreToDefaultWarehouseScenario.execute({storeName: staticFixtures.store.name, shouldTriggerPublishAndSync: true});
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      productAbstract = createProductScenario.execute({ shouldTriggerPublishAndSync: true });
      selectStoreScenario.execute(staticFixtures.store.name);
    });

    it('backoffice user should be able to create new product that will be available for guests in storefront', (): void => {
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
        withoutSession: true,
      });

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
  }
);

interface ProductAbstract {
  name: string;
  sku: string;
  price: string;
  description: string;
}
