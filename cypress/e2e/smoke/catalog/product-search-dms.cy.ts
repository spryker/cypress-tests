import { container } from '@utils';
import { CatalogPage, HomePage, ProductPage } from '@pages/yves';
import { ProductSearchDmsStaticFixtures } from '@interfaces/smoke';
import { CustomerLoginScenario } from '@scenarios/yves';
import { AssignExistingProductToStoreScenario, CreateStoreScenario, UserLoginScenario } from '@scenarios/backoffice';

(Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)(
  'product search dms',
  { tags: ['@smoke'] },
  (): void => {
    const homePage = container.get(HomePage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const createStoreScenario = container.get(CreateStoreScenario);
    const assignExistingProductToStoreScenario = container.get(AssignExistingProductToStoreScenario);

    let staticFixtures: ProductSearchDmsStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');

      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      createStoreScenario.execute({ store: staticFixtures.defaultStore });
      assignExistingProductToStoreScenario.execute({
        abstractProductSku: staticFixtures.concreteProduct.abstract_sku,
        warehouse: staticFixtures.defaultWarehouse,
        productPrice: staticFixtures.productPrice,
      });
    });

    beforeEach((): void => {
      homePage.visit();
      homePage.selectStore(staticFixtures.defaultStore);
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
      homePage.selectStore(staticFixtures.defaultStore);
      catalogPage.searchProductFromSuggestions({ query: staticFixtures.concreteProduct.abstract_sku });

      assertProductDetailInformation();
    });

    it('customer should be able to find product concrete in catalog', (): void => {
      customerLoginScenario.execute({
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      catalogPage.visit();
      homePage.selectStore(staticFixtures.defaultStore);
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
  }
);
