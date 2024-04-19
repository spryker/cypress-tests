import { container } from '@utils';
import { CreateProductScenario, UserLoginScenario } from '@scenarios/backoffice';
import { CatalogPage, ProductPage } from '../../../support/pages/yves';
import { ProductStaticFixtures, PublishAndSynchronizeDynamicFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '../../../support/scenarios/yves';

describe('publish and synchronize', { tags: ['@product', '@smoke'] }, (): void => {
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const userLoginScenario = container.get(UserLoginScenario);
  const createProductScenario = container.get(CreateProductScenario);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let dynamicFixtures: PublishAndSynchronizeDynamicFixtures;
  let staticFixtures: ProductStaticFixtures;
  let productAbstract: ProductAbstract;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    productAbstract = createProductScenario.execute();
  });

  it('backoffice user should be able to create new product that will be available for guests in storefront', (): void => {
    catalogPage.visit();
    catalogPage.search({ query: productAbstract.name });

    cy.contains(productAbstract.name);
    cy.contains(productAbstract.sku);
    cy.contains(productAbstract.price);
    cy.contains(productAbstract.description);

    productPage.addToCart();
    cy.contains(productPage.getAddToCartSuccessMessage());
  });

  it('backoffice user should be able to create new product that will be available for customers in storefront', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    catalogPage.visit();
    catalogPage.search({ query: productAbstract.name });

    cy.contains(productAbstract.name);
    cy.contains(productAbstract.sku);
    cy.contains(productAbstract.price);
    cy.contains(productAbstract.description);

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
