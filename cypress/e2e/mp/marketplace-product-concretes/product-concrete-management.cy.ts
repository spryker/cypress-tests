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

    it('given a merchant that created a multi sku product when the back office approves it then the storefront serves it, and denying it takes the detail page away', (): void => {
      // Arrange
      const sku = `SKU${Date.now()}`;
      const name = `Product ${sku}`;
      const createdProduct = staticFixtures.createdProduct;

      signInToPortal();
      productsPage.visit();
      productsPage.createMultiConcreteProduct({
        sku: sku,
        name: name,
        attributeName: createdProduct.attributeName,
        attributeValues: createdProduct.attributeValues,
      });

      // The wizard leaves a draft that carries neither store, tax set nor price, and none of them
      // has a default the merchant could rely on.
      openProductInPortal(sku);
      productsPage.fillLocalizedNames({ name: name });
      productsPage.selectStores({ storeNames: [staticFixtures.storeName] });
      productsPage.selectFirstTaxSet();
      productsPage.addPriceRow({
        storeName: staticFixtures.storeName,
        currency: staticFixtures.currency,
        netAmount: createdProduct.netAmount,
        grossAmount: createdProduct.grossAmount,
      });
      productsPage.assertBodyContainsText(PRODUCT_SAVED_MESSAGE);

      openProductInPortal(sku);
      productsPage.openConcreteProductsTab();
      productsPage.openFirstConcreteProduct();
      productsPage.activateConcreteProduct({
        stockQuantity: createdProduct.stockQuantity,
        searchableLocales: createdProduct.searchableLocales,
      });
      productsPage.save();
      productsPage.assertBodyContainsText(PRODUCT_SAVED_MESSAGE);

      // Act
      openProductInPortal(sku);
      productsPage.sendForApproval();

      productsPage.visit();
      productsPage.find({ query: sku }).should('contain.text', WAITING_FOR_APPROVAL_STATUS);

      signInToBackoffice();
      productManagementListPage.visit();
      productManagementListPage.update({ query: sku, action: ActionEnum.approve });

      // Assert
      cy.runCliCommands(publishAndSyncCommands);

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: sku });
      cy.url().then((productDetailPageUrl) => {
        productPage.getSoldByProductOffers().should('contain.text', dynamicFixtures.merchant.name);
        productPage.getProductDetailPrice().should('contain', createdProduct.displayedPrice);

        // Act
        signInToBackoffice();
        productManagementListPage.visit();
        productManagementListPage.update({ query: sku, action: ActionEnum.deny });

        // Assert
        cy.reloadUntilGone(productDetailPageUrl, ADD_TO_CART_BUTTON_SELECTOR, 'body', 10, 3000, publishAndSyncCommands);
      });
    });

    function signInToPortal(): void {
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });
    }

    function signInToBackoffice(): void {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    }

    // Saving an abstract product closes its drawer, so each stage opens it again.
    function openProductInPortal(sku: string): void {
      productsPage.visit();
      productsPage.getFirstTableRow().should('exist');
      productsPage.find({ query: sku }).click();
    }
  }
);

const PRODUCT_SAVED_MESSAGE = 'The Product is saved.';
const WAITING_FOR_APPROVAL_STATUS = 'Waiting for Approval';

// A denied product has no detail page left, and this is what the page loses first. It is the same
// attribute in every storefront theme, so it holds for all three repositories this spec runs in.
const ADD_TO_CART_BUTTON_SELECTOR = '[data-qa="add-to-cart-button"]';
