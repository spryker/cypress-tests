import { container } from '@utils';
import { CatalogPage, ProductPage } from '@pages/yves';
import { ProductSearchStaticFixtures } from '@interfaces/smoke';
import { CustomerLoginScenario } from '@scenarios/yves';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
describe('product search', { tags: ['@smoke', '@catalog'] }, (): void => {
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let staticFixtures: ProductSearchStaticFixtures;

  before((): void => {
    staticFixtures = Cypress.env('staticFixtures');
  });

  skipB2BIt('guest should be able to find product abstract in catalog', (): void => {
    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: staticFixtures.concreteProduct.abstract_sku });

    assertProductDetailInformation();
  });

  skipB2BIt('guest should be able to find product concrete in catalog', (): void => {
    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: staticFixtures.concreteProduct.sku });

    assertProductDetailInformation();
  });

  it('customer should be able to find product abstract in catalog', (): void => {
    customerLoginScenario.execute({
      email: staticFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: staticFixtures.concreteProduct.abstract_sku });

    assertProductDetailInformation();
  });

  it('customer should be able to find product concrete in catalog', (): void => {
    customerLoginScenario.execute({
      email: staticFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: staticFixtures.concreteProduct.sku });

    assertProductDetailInformation();
  });

  function assertProductDetailInformation(): void {
    cy.contains(staticFixtures.concreteProduct.name);

    productPage.getProductConfigurator().should('contain', staticFixtures.productPrice);
    productPage.getProductConfigurator().should('contain', staticFixtures.concreteProduct.sku);
  }

  function skipB2BIt(description: string, testFn: () => void): void {
    (['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
  }
});
