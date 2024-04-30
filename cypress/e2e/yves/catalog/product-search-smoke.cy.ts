import { container } from '@utils';
import { CatalogPage, ProductPage } from '@pages/yves';
import { ProductSearchSmokeStaticFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe('product search smoke', { tags: ['@catalog', '@smoke'] }, (): void => {
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let staticFixtures: ProductSearchSmokeStaticFixtures;

  before((): void => {
    staticFixtures = Cypress.env('staticFixtures');
  });

  skipB2BIt('guest should be able to find product abstract in catalog', (): void => {
    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: staticFixtures.concreteProduct.abstract_sku });

    assertProductDetails();
  });

  skipB2BIt('guest should be able to find product concrete in catalog', (): void => {
    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: staticFixtures.concreteProduct.sku });

    assertProductDetails();
  });

  it('customer should be able to find product abstract in catalog', (): void => {
    customerLoginScenario.execute({
      email: staticFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: staticFixtures.concreteProduct.abstract_sku });

    assertProductDetails();
  });

  it('customer should be able to find product concrete in catalog', (): void => {
    customerLoginScenario.execute({
      email: staticFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: staticFixtures.concreteProduct.sku });

    assertProductDetails();
  });

  function assertProductDetails(): void {
    cy.contains(staticFixtures.concreteProduct.name);
    productPage.getProductConfigurator().should('contain', staticFixtures.productPrice);
    productPage.getProductConfigurator().should('contain', staticFixtures.concreteProduct.sku);
  }

  function skipB2BIt(description: string, testFn: () => void): void {
    (Cypress.env('repositoryId') === 'b2b' ? it.skip : it)(description, testFn);
  }
});
