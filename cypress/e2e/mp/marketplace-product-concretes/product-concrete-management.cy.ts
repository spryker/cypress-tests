import { container } from '@utils';
import { ProductConcreteManagementDynamicFixtures, ProductConcreteManagementStaticFixtures } from '@interfaces/mp';
import { ProductsPage, VariantsPage } from '@pages/mp';
import { ActionEnum, ProductManagementListPage } from '@pages/backoffice';
import { CatalogPage, ProductPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { MerchantUserLoginScenario } from '@scenarios/mp';

describe(
  'product concretes management',
  {
    tags: [
      '@mp',
      '@merchant-product-concretes',
      'product',
      'marketplace-merchantportal-core',
      'marketplace-product',
      'marketplace-merchant-portal-product-management',
      'spryker-core',
    ],
  },
  (): void => {
    if (['b2b', 'b2c'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite, b2b-mp and b2c-mp', () => {});
      return;
    }
    const variantsPage = container.get(VariantsPage);
    const productsPage = container.get(ProductsPage);
    const productManagementListPage = container.get(ProductManagementListPage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);

    // A tree-wide publish times the gateway out, so this stays narrowed to the catalog.
    const publishAndSyncCommands = [
      'console publish:trigger-events -r product_abstract',
      'console queue:worker:start --stop-when-empty',
    ];

    let dynamicFixtures: ProductConcreteManagementDynamicFixtures;
    let staticFixtures: ProductConcreteManagementStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    it('merchant user should be able to see table with product concretes', (): void => {
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      variantsPage.visit();
      variantsPage.getProductConcretesCountSelector().contains('2 Result(s)');
    });

    it('given a merchant that created a multi sku product when it sends the product for approval then the product list shows it waiting for approval', (): void => {
      // Arrange
      const sku = `SKU${Date.now()}`;

      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      productsPage.visit();
      productsPage.createMultiConcreteProduct({
        sku: sku,
        name: `Product ${sku}`,
        attributeName: staticFixtures.createdProduct.attributeName,
        attributeValues: staticFixtures.createdProduct.attributeValues,
      });

      // Act
      productsPage.openProduct({ query: sku });
      productsPage.sendForApproval();

      // Assert
      productsPage.visit();
      productsPage.find({ query: sku }).should('contain.text', WAITING_FOR_APPROVAL_STATUS);
    });

    it('given a merchant product waiting for approval when the back office approves it then the storefront serves it, and denying it takes the detail page away', (): void => {
      // Arrange
      const abstractSku = dynamicFixtures.pendingProduct.abstract_sku;

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      // Act
      productManagementListPage.visit();
      productManagementListPage.update({ query: abstractSku, action: ActionEnum.approve });

      cy.runCliCommands(publishAndSyncCommands);

      // Assert
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: abstractSku });
      cy.url().then((productDetailPageUrl) => {
        productPage.getSoldByProductOffers().should('contain.text', dynamicFixtures.approvalMerchant.name);
        productPage.getProductDetailPrice().should('contain', staticFixtures.pendingProductPrice);

        // Act
        userLoginScenario.execute({
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });
        productManagementListPage.visit();
        productManagementListPage.update({ query: abstractSku, action: ActionEnum.deny });

        // Assert
        cy.reloadUntilGone(productDetailPageUrl, ADD_TO_CART_BUTTON_SELECTOR, 'body', 10, 3000, publishAndSyncCommands);
      });
    });
  }
);

const WAITING_FOR_APPROVAL_STATUS = 'Waiting for Approval';

// A denied product has no detail page left, and this is what the page loses first. It is the same
// attribute in every storefront theme, so it holds for all three repositories this spec runs in.
const ADD_TO_CART_BUTTON_SELECTOR = '[data-qa="add-to-cart-button"]';
