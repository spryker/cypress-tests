import { container } from '@utils';
import { CatalogPage, ProductPage } from '@pages/yves';
import { ProductSearchDynamicFixtures, ProductSearchStaticFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe('product search', { tags: ['@catalog', '@smoke'] }, (): void => {
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let dynamicFixtures: ProductSearchDynamicFixtures;
  let staticFixtures: ProductSearchStaticFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('guest should be able to find product in catalog', (): void => {
    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.concreteProduct.abstract_sku });

    assertProductDetails();
  });

  it('customer should be able to find product in catalog', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.concreteProduct.abstract_sku });

    assertProductDetails();
  });

  function assertProductDetails(): void {
    cy.contains(dynamicFixtures.concreteProduct.name);
    productPage.getProductConfigurator().should('contain', staticFixtures.productPrice);
    productPage.getProductConfigurator().should('contain', dynamicFixtures.concreteProduct.sku);
  }
});
