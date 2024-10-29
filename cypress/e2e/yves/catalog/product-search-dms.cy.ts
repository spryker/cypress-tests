import { container } from '@utils';
import { CatalogPage, ProductPage } from '@pages/yves';
import { ProductSearchDmsStaticFixtures } from '@interfaces/smoke';
import { CustomerLoginScenario, SelectStoreScenario } from '@scenarios/yves';
import {
  CreateStoreScenario,
  EnableProductForAllStoresScenario,
  EnableWarehouseForAllStoresScenario,
  UserLoginScenario,
} from '@scenarios/backoffice';

(Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)(
  'product search dms',
  { tags: ['@smoke'] },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const createStoreScenario = container.get(CreateStoreScenario);
    const selectStoreScenario = container.get(SelectStoreScenario);
    const enableWarehouseForAllStoresScenario = container.get(EnableWarehouseForAllStoresScenario);
    const enableProductForAllStoresScenario = container.get(EnableProductForAllStoresScenario);

    let staticFixtures: ProductSearchDmsStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');

      assignStoreRelationToExistingProduct();
    });

    beforeEach((): void => {
      selectStoreScenario.execute(staticFixtures.store.name);
      ensureCatalogVisibility();
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

      selectStoreScenario.execute(staticFixtures.store.name);

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: staticFixtures.concreteProduct.abstract_sku });

      assertProductDetailInformation();
    });

    it('customer should be able to find product concrete in catalog', (): void => {
      customerLoginScenario.execute({
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      selectStoreScenario.execute(staticFixtures.store.name);

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

    function assignStoreRelationToExistingProduct(): void {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      createStoreScenario.execute({ store: staticFixtures.store });
      enableWarehouseForAllStoresScenario.execute({ warehouse: staticFixtures.warehouse });
      enableProductForAllStoresScenario.execute({
        abstractProductSku: staticFixtures.concreteProduct.abstract_sku,
        productPrice: staticFixtures.productPrice,
      });
    }

    function ensureCatalogVisibility(attempts: number = 0, maxAttempts: number = 5): void {
      catalogPage.visit();
      catalogPage.hasProductsInCatalog().then((isVisible) => {
      if (isVisible) {
        return;
      }

      if (attempts < maxAttempts) {
        cy.wait(3000);
        ensureCatalogVisibility(attempts + 1, maxAttempts);
      }

      throw new Error("Catalog is not visible after maximum attempts");
      });
    }
  }
);
