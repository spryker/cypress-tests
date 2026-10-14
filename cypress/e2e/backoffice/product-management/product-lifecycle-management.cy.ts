import { container } from '@utils';
import {
  ProductLifecycleManagementDynamicFixtures,
  ProductLifecycleManagementStaticFixtures,
} from '@interfaces/backoffice';
import { CatalogPage, ProductPage } from '@pages/yves';
import { ProductManagementEditVariantPage } from '@pages/backoffice';
import { CreateProductScenario, UserLoginScenario } from '@scenarios/backoffice';
import { CustomerLoginScenario } from '@scenarios/yves';

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
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      catalogPage.visit();
      catalogPage.search({ query: productAbstract.name });

      // Assert
      productPage.assertBodyContainsText(productAbstract.sku);
    });

    it('given an abstract product whose only variant is deactivated in the back office when the catalog is searched then the storefront no longer lists it', (): void => {
      // Arrange
      // An absence is only evidence once the product has been seen in the catalog.
      const productAbstract = createProductScenario.execute({ shouldTriggerPublishAndSync: true });
      // Product creation ends on the variant edit page, which is left to confirm the catalog listing.
      let variantEditUrl: string;
      cy.url().then((url: string): void => {
        variantEditUrl = url;
      });

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      catalogPage.waitUntilProductIsListed(productAbstract.name);

      // Act
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      cy.then((): void => {
        cy.visit(variantEditUrl);
      });
      productManagementEditVariantPage.deactivate();
      cy.runQueueWorker();

      // Assert
      // Deactivating the last active variant takes the abstract out of the catalog, so the card that
      // was just seen there does not survive.
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      catalogPage.waitUntilProductIsNotListed(productAbstract.name);
    });
  }
);
