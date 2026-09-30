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

const PRODUCT_CARD_SELECTOR = '[data-qa="component product-item"]';

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
      loginAsBackofficeUser();
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

      // The variant edit page is held by url rather than by staying on it: an absence is only
      // evidence once the product has been seen in the catalog, and confirming that navigates away.
      cy.url().then((variantUrl: string): void => {
        loginAsCustomer();
        cy.reloadUntilFound(
          searchUrlFor(productAbstract.name),
          productCardSelectorFor(productAbstract.name),
          'body',
          PUBLISH_RELOAD_ATTEMPTS,
          PUBLISH_RELOAD_INTERVAL_MS
        );

        // Act
        loginAsBackofficeUser();
        cy.visit(variantUrl);
        productManagementEditVariantPage.deactivate();
        cy.runQueueWorker();

        // Assert
        // Deactivating the last active variant takes the abstract out of the catalog, so the card
        // that was just seen there does not survive.
        loginAsCustomer();
        cy.reloadUntilGone(
          searchUrlFor(productAbstract.name),
          productCardSelectorFor(productAbstract.name),
          'body',
          PUBLISH_RELOAD_ATTEMPTS,
          PUBLISH_RELOAD_INTERVAL_MS
        );
      });
    });

    function searchUrlFor(productName: string): string {
      return `/search?q=${encodeURIComponent(productName)}`;
    }

    function productCardSelectorFor(productName: string): string {
      return `${PRODUCT_CARD_SELECTOR}:contains("${productName}")`;
    }

    function loginAsCustomer(): void {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
    }

    function loginAsBackofficeUser(): void {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    }
  }
);
