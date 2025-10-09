import { container } from '@utils';
import { CreateProductScenario, CreateStoreScenario, UserLoginScenario } from '@scenarios/backoffice';
import { CatalogPage, ProductPage } from '@pages/yves';
import { PublishAndSynchronizeDmsDynamicFixtures, PublishAndSynchronizeDmsStaticFixtures } from '@interfaces/yves';
import { CustomerLoginScenario, SelectStoreScenario } from '@scenarios/yves';

describeIfDynamicStoreEnabled(
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
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const createProductScenario = container.get(CreateProductScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const createStoreScenario = container.get(CreateStoreScenario);
    const selectStoreScenario = container.get(SelectStoreScenario);

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

function describeIfDynamicStoreEnabled(title: string, options: { tags: string[] }, fn: () => void): void {
  (Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)(title, fn);
}

interface ProductAbstract {
  name: string;
  sku: string;
  price: string;
  description: string;
}
