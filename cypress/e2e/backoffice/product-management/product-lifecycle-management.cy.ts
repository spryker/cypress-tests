import { container } from '@utils';
import {
  ProductLifecycleManagementDynamicFixtures,
  ProductLifecycleManagementStaticFixtures,
} from '@interfaces/backoffice';
import { CatalogPage, ProductPage } from '@pages/yves';
import { ProductManagementEditVariantPage } from '@pages/backoffice';
import { CreateProductScenario, UserLoginScenario } from '@scenarios/backoffice';
import { CustomerLoginScenario } from '@scenarios/yves';

const PUBLISH_RELOAD_ATTEMPTS = 15;

const PUBLISH_RELOAD_INTERVAL_MS = 3000;

describe(
  'product lifecycle management',
  {
    tags: [
      '@backoffice',
      'product',
      'marketplace-product',
      'product-approval-process',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const productManagementEditVariantPage = container.get(ProductManagementEditVariantPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const createProductScenario = container.get(CreateProductScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: ProductLifecycleManagementStaticFixtures;
    let dynamicFixtures: ProductLifecycleManagementDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('given an abstract product created and approved in the back office when the catalog is searched then the storefront lists it', (): void => {
      // Arrange
      const productAbstract = createProductScenario.execute({ shouldTriggerPublishAndSync: true });

      // Act
      loginAsCustomer();
      catalogPage.visit();
      catalogPage.search({ query: productAbstract.name });

      // Assert
      productPage.assertBodyContainsText(productAbstract.sku);
    });

    it('given an abstract product whose only variant is deactivated in the back office when the catalog is searched then the storefront no longer lists it', (): void => {
      // Arrange
      const productAbstract = createProductScenario.execute({ shouldTriggerPublishAndSync: true });

      // Act
      // Creating leaves the browser on the variant it just activated, so it is deactivated from
      // there — reaching the same page again through the product table only adds a second
      // asynchronous table render to race with.
      productManagementEditVariantPage.deactivate();
      cy.runQueueWorker();

      // Assert
      // Deactivating the last active variant takes the abstract out of the catalog, so no card for
      // it survives in the search results.
      loginAsCustomer();
      cy.reloadUntilGone(
        `/search?q=${encodeURIComponent(productAbstract.name)}`,
        `[data-qa="component product-item"]:contains("${productAbstract.name}")`,
        'body',
        PUBLISH_RELOAD_ATTEMPTS,
        PUBLISH_RELOAD_INTERVAL_MS
      );
    });

    function loginAsCustomer(): void {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
    }
  }
);
