import { container } from '@utils';
import { MerchantProductManagementDynamicFixtures, MerchantProductManagementStaticFixtures } from '@interfaces/mp';
import { ActionEnum, ProductManagementEditPage, ProductManagementListPage } from '@pages/backoffice';
import { ProductsPage } from '@pages/mp';
import { CatalogPage, ProductPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { MerchantUserLoginScenario } from '@scenarios/mp';

describe(
  'merchant product management',
  {
    tags: [
      '@mp',
      '@merchant-product-concretes',
      'product',
      'marketplace-product',
      'marketplace-merchantportal-core',
      'marketplace-merchant-portal-product-management',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because merchant products exist only in suite, b2b-mp and b2c-mp', () => {});

      return;
    }

    const productsPage = container.get(ProductsPage);
    const productManagementListPage = container.get(ProductManagementListPage);
    const productManagementEditPage = container.get(ProductManagementEditPage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);

    // A tree-wide publish times the gateway out, so this stays narrowed to the catalog.
    const publishAndSyncCommands = [
      'console publish:trigger-events -r product_abstract',
      'console queue:worker:start --stop-when-empty',
    ];

    let staticFixtures: MerchantProductManagementStaticFixtures;
    let dynamicFixtures: MerchantProductManagementDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a merchant product with one variant when the merchant adds another concrete and the back office renames the product then the storefront serves both changes', (): void => {
      // Arrange
      const addedConcrete = staticFixtures.addedConcrete;
      const abstractSku = dynamicFixtures.variantProduct.abstract_sku;
      const renamedProduct = `Renamed ${abstractSku}`;

      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      openProductInPortal(abstractSku);
      productsPage.openConcreteProductsTab();

      productsPage.getVariantRows().should('not.contain.text', addedConcrete.attributeValue);

      // Act
      productsPage.addConcreteProducts({ attributeValues: [addedConcrete.attributeValue] });

      // Assert
      openProductInPortal(abstractSku);
      productsPage.openConcreteProductsTab();
      productsPage.getVariantRows().should('contain.text', addedConcrete.attributeValue);

      // Act
      // A concrete product reaches the storefront only once it is active, stocked and searchable.
      productsPage.openConcreteProduct({ rowText: addedConcrete.attributeValue });
      productsPage.activateConcreteProduct({
        stockQuantity: addedConcrete.stockQuantity,
        searchableLocales: addedConcrete.searchableLocales,
      });
      productsPage.save();
      productsPage.assertBodyContainsText(PRODUCT_SAVED_MESSAGE);

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      productManagementListPage.visit();
      productManagementListPage.update({ query: abstractSku, action: ActionEnum.edit });
      productManagementEditPage.renameProduct({ name: renamedProduct });

      // Assert
      cy.runCliCommands(publishAndSyncCommands);

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: abstractSku });
      productPage.getBody().should('contain.text', renamedProduct);
      productPage.getVariantAttributeOptions(VARIANT_ATTRIBUTE_KEY).should('have.length.at.least', 2);
    });

    // Saving an abstract product closes its drawer, so each stage opens it again.
    function openProductInPortal(abstractSku: string): void {
      productsPage.visit();
      productsPage.getFirstTableRow().should('exist');
      productsPage.find({ query: abstractSku }).click();
    }
  }
);

const PRODUCT_SAVED_MESSAGE = 'The Product is saved.';

// The super attribute the fixture product varies on.
const VARIANT_ATTRIBUTE_KEY = 'color';
