import { container } from '@utils';
import { ProductPage } from '@pages/yves';
import { ProductManagementEditPage } from '@pages/backoffice';
import { MultistoreProductDynamicFixtures, MultistoreProductStaticFixtures } from '@interfaces/yves';
import { AssignStoreToProductScenario, UserLoginScenario } from '@scenarios/backoffice';
import { OpenProductDetailPageOnStoreScenario, WaitForStorefrontUrlScenario } from '@scenarios/yves';

describe(
  'multistore product',
  {
    tags: ['@yves', '@product', 'product', 'prices', 'catalog', 'search', 'spryker-core', 'spryker-core-back-office'],
  },
  (): void => {
    const productPage = container.get(ProductPage);
    const productManagementEditPage = container.get(ProductManagementEditPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const openProductDetailPageOnStoreScenario = container.get(OpenProductDetailPageOnStoreScenario);
    const waitForStorefrontUrlScenario = container.get(WaitForStorefrontUrlScenario);
    const assignStoreToProductScenario = container.get(AssignStoreToProductScenario);

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

      // A retry re-runs the test but not this hook, and by then the product is off the store — its
      // detail page could no longer be opened to read the url off. So it is read here, while the
      // product is still there, and the test only has to unassign and re-request it.
      openProductDetailPageOnStoreScenario.execute({
        storeName: staticFixtures.secondaryStoreName,
        abstractSku: dynamicFixtures.productToUnassign.abstract_sku,
        sku: dynamicFixtures.productToUnassign.sku,
        productName: dynamicFixtures.productToUnassign.localized_attributes[0].name,
      });
      cy.url().then((detailPageUrl: string) => {
        productDetailPageUrl = detailPageUrl;
      });
    });

    it('given a product is priced per store when a shopper opens its detail page on each store then each store shows its own price', (): void => {
      // Arrange
      const primaryStorePrice = `${staticFixtures.currencySymbol}${staticFixtures.primaryStorePrice}.00`;
      const secondaryStorePrice = `${staticFixtures.currencySymbol}${staticFixtures.secondaryStorePrice}.00`;

      // Act
      openProductDetailPageOnStoreScenario.execute({
        storeName: staticFixtures.primaryStoreName,
        abstractSku: dynamicFixtures.product.abstract_sku,
        sku: dynamicFixtures.product.sku,
        productName: dynamicFixtures.product.localized_attributes[0].name,
      });

      // Assert
      productPage.getProductConfigurator().should('contain', primaryStorePrice);

      // Act
      openProductDetailPageOnStoreScenario.execute({
        storeName: staticFixtures.secondaryStoreName,
        abstractSku: dynamicFixtures.product.abstract_sku,
        sku: dynamicFixtures.product.sku,
        productName: dynamicFixtures.product.localized_attributes[0].name,
      });

      // Assert
      productPage.getProductConfigurator().should('contain', secondaryStorePrice);
    });

    it('given a product is unassigned from a store when a shopper opens its detail page on that store then the page is not found', (): void => {
      // Arrange
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      // Act
      productManagementEditPage.visitProduct(String(dynamicFixtures.productToUnassign.fk_product_abstract));
      productManagementEditPage.setDummyDEName(); // Gap in dynamic fixtures
      productManagementEditPage.unassignStore(staticFixtures.secondaryStoreName);
      productManagementEditPage.save();
      cy.runQueueWorker();

      // Assert
      waitForStorefrontUrlScenario.execute({ url: productDetailPageUrl, shouldBeServed: false });
    });
  }
);
