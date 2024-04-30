import { container } from '@utils';
import { CreateProductScenario, UserLoginScenario } from '@scenarios/backoffice';
import { CatalogPage, ProductPage } from '@pages/yves';
import { PublishAndSynchronizeSmokeStaticFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
describe('publish and synchronize smoke', { tags: ['@product', '@smoke'] }, (): void => {
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const userLoginScenario = container.get(UserLoginScenario);
  const createProductScenario = container.get(CreateProductScenario);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let staticFixtures: PublishAndSynchronizeSmokeStaticFixtures;
  let productAbstract: ProductAbstract;

  before((): void => {
    staticFixtures = Cypress.env('staticFixtures');
  });

  beforeEach((): void => {
    userLoginScenario.execute({
      username: staticFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    productAbstract = createProductScenario.execute();
  });

  it('backoffice user should be able to create new product that will be available for guests in storefront', (): void => {
    catalogPage.visit();
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
      email: staticFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    catalogPage.visit();
    catalogPage.search({ query: productAbstract.name });

    cy.contains(productAbstract.name);
    cy.contains(productAbstract.sku);
    cy.contains(productAbstract.description);
    cy.contains(productAbstract.price);

    productPage.addToCart();
    cy.contains(productPage.getAddToCartSuccessMessage());
  });
});

interface ProductAbstract {
  name: string;
  sku: string;
  price: string;
  description: string;
}
