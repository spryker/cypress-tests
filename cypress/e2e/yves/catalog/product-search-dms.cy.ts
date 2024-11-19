import { container } from '@utils';
import { CatalogPage, ProductPage } from '@pages/yves';
import { ProductSearchDmsDynamicFixtures, ProductSearchDmsStaticFixtures } from '@interfaces/yves';
import { CustomerLoginScenario, SelectStoreScenario } from '@scenarios/yves';
import { AssignStoreToProductScenario } from '@scenarios/backoffice';

describeIfDynamicStoreEnabled('product search dms', { tags: ['@yves', '@catalog', '@dms'] }, (): void => {
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const customerLoginScenario = container.get(CustomerLoginScenario);
  const selectStoreScenario = container.get(SelectStoreScenario);
  const assignStoreToProductScenario = container.get(AssignStoreToProductScenario);

  let staticFixtures: ProductSearchDmsStaticFixtures;
  let dynamicFixtures: ProductSearchDmsDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
    assignStoreToProduct();
  });

  beforeEach((): void => {
    selectStoreScenario.execute(staticFixtures.store.name);
  });

  skipB2BIt('guest should be able to find product abstract in catalog', (): void => {
    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.abstract_sku });

    assertProductDetailInformation();
  });

  skipB2BIt('guest should be able to find product concrete in catalog', (): void => {
    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });

    assertProductDetailInformation();
  });

  it('customer should be able to find product abstract in catalog', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    selectStoreScenario.execute(staticFixtures.store.name);

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.abstract_sku });

    assertProductDetailInformation();
  });

  it('customer should be able to find product concrete in catalog', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    selectStoreScenario.execute(staticFixtures.store.name);

    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });

    assertProductDetailInformation();
  });

  function assertProductDetailInformation(): void {
    cy.contains(dynamicFixtures.product.localized_attributes[0].name);
    productPage.getProductConfigurator().should('contain', dynamicFixtures.product.sku);
  }

  function assignStoreToProduct(): void {
    const assignStoreToProductScenarioParams = {
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
      store: staticFixtures.store,
      abstractSku: dynamicFixtures.product.abstract_sku,
      shouldTriggerPublishAndSync: true,
    };

    assignStoreToProductScenario.execute(assignStoreToProductScenarioParams);
  }

  function skipB2BIt(description: string, testFn: () => void): void {
    (['b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
  }
});

function describeIfDynamicStoreEnabled(title: string, options: { tags: string[] }, fn: () => void): void {
  (Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)(title, fn);
}
