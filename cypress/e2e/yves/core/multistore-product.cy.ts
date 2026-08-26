import { container } from '@utils';
import { CatalogPage, ProductPage } from '@pages/yves';
import { ProductManagementEditPage } from '@pages/backoffice';
import { MultistoreProductDynamicFixtures, MultistoreProductStaticFixtures } from '@interfaces/yves';
import { AssignStoreToProductScenario, UserLoginScenario } from '@scenarios/backoffice';
import { SelectStoreScenario } from '@scenarios/yves';

describe(
  'multistore product',
  {
    tags: [
      '@yves',
      '@core',
      '@product',
      'product',
      'prices',
      'catalog',
      'search',
      'spryker-core',
      'spryker-core-back-office',
    ],
  },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const productManagementEditPage = container.get(ProductManagementEditPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const selectStoreScenario = container.get(SelectStoreScenario);
    const assignStoreToProductScenario = container.get(AssignStoreToProductScenario);

    const HTTP_STATUS_OK = 200;
    const HTTP_STATUS_NOT_FOUND = 404;
    // A store that no longer carries the product answers with a redirect to its own error page
    // instead of a bare 404, so "not found" is recognised by that target as well.
    const NOT_FOUND_PAGE_PATH = 'error-page/404';
    // Publish and synchronize is asynchronous; every retry drains the queue again before
    // re-reading the storefront, which is what the Robot original did by repeating its
    // publish-and-sync trigger.
    const PUBLISH_AND_SYNC_ATTEMPTS = 10;

    let staticFixtures: MultistoreProductStaticFixtures;
    let dynamicFixtures: MultistoreProductDynamicFixtures;

    let productDetailPageUrl: string;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      // One product priced differently per store, so the storefront assertions can only pass if the
      // price really is store-scoped and not a single global value.
      productManagementEditPage.visitProduct(String(dynamicFixtures.product.fk_product_abstract));
      productManagementEditPage.setDummyDEName(); // Gap in dynamic fixtures
      productManagementEditPage.setStorePrice({
        storeName: staticFixtures.primaryStoreName,
        price: staticFixtures.primaryStorePrice,
      });
      productManagementEditPage.setStorePrice({
        storeName: staticFixtures.secondaryStoreName,
        price: staticFixtures.secondaryStorePrice,
      });
      productManagementEditPage.save();

      // A second product, priced the same everywhere, is the one the unassign test takes away — so
      // neither test depends on what the other did to the catalogue.
      assignStoreToProductScenario.execute({
        abstractProductSku: dynamicFixtures.productToUnassign.abstract_sku,
        bulkProductPrice: staticFixtures.unassignedStoreProductPrice,
        shouldTriggerPublishAndSync: true,
      });
    });

    it('given a product is priced per store when a shopper opens its detail page on each store then each store shows its own price', (): void => {
      // Arrange
      const primaryStorePrice = `${staticFixtures.currencySymbol}${staticFixtures.primaryStorePrice}.00`;
      const secondaryStorePrice = `${staticFixtures.currencySymbol}${staticFixtures.secondaryStorePrice}.00`;

      // Act
      openProductDetailPageOnStore(staticFixtures.primaryStoreName, dynamicFixtures.product);

      // Assert
      productPage.getProductConfigurator().should('contain', primaryStorePrice);

      // Act
      openProductDetailPageOnStore(staticFixtures.secondaryStoreName, dynamicFixtures.product);

      // Assert
      productPage.getProductConfigurator().should('contain', secondaryStorePrice);
    });

    it('given a product is unassigned from a store when a shopper opens its detail page on that store then the page is not found', (): void => {
      // Arrange
      openProductDetailPageOnStore(staticFixtures.secondaryStoreName, dynamicFixtures.productToUnassign);
      cy.url().then((detailPageUrl: string) => {
        productDetailPageUrl = detailPageUrl;
      });

      // Act
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      productManagementEditPage.visitProduct(String(dynamicFixtures.productToUnassign.fk_product_abstract));
      productManagementEditPage.setDummyDEName(); // Gap in dynamic fixtures
      productManagementEditPage.unassignStore(staticFixtures.secondaryStoreName);
      productManagementEditPage.save();
      cy.runQueueWorker();

      // Assert
      waitForProductDetailPageStatus(false);
    });

    // The suggestion dropdown ranks by completion, so a sku query can put a sibling fixture product
    // first and the spec would then read prices, or a 404, off the wrong detail page. Going through
    // the result blocks and matching on the product name keeps it exact, and the closing check makes
    // a wrong landing fail here rather than as a mystery timeout further down.
    function openProductDetailPageOnStore(
      storeName: string,
      product: MultistoreProductDynamicFixtures['product']
    ): void {
      selectStoreScenario.execute(storeName);
      catalogPage.searchForProducts({ query: product.abstract_sku });
      catalogPage.openProductDetailPageFromResults({ productName: product.localized_attributes[0].name });
      productPage.getProductConfigurator().should('contain', product.sku);
    }

    function waitForProductDetailPageStatus(shouldBeServed: boolean, attemptsLeft = PUBLISH_AND_SYNC_ATTEMPTS): void {
      cy.then(() => {
        cy.request({ url: productDetailPageUrl, failOnStatusCode: false, followRedirect: false }).then((response) => {
          const isServed = response.status === HTTP_STATUS_OK;
          const isNotFound =
            response.status === HTTP_STATUS_NOT_FOUND || String(response.redirectedToUrl).includes(NOT_FOUND_PAGE_PATH);
          const isSettled = shouldBeServed ? isServed : isNotFound;

          if (isSettled || attemptsLeft === 0) {
            expect(isSettled, `store url ${productDetailPageUrl} serves the product: ${shouldBeServed}`).to.equal(true);

            return;
          }

          cy.runQueueWorker();
          waitForProductDetailPageStatus(shouldBeServed, attemptsLeft - 1);
        });
      });
    }
  }
);
