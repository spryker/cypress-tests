import { container } from '@utils';
import { CustomerSpecificPricesDynamicFixtures, CustomerSpecificPricesStaticFixtures } from '@interfaces/mp';
import { MerchantRelationshipCreatePage } from '@pages/backoffice';
import { ProductsPage } from '@pages/mp';
import { CatalogPage, ProductPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { MerchantUserLoginScenario } from '@scenarios/mp';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'customer specific prices',
  {
    tags: [
      '@mp',
      '@merchant-portal',
      'prices',
      'marketplace-merchant-custom-prices',
      'merchant-custom-prices',
      'marketplace-product',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because customer specific prices need company users, which exist in suite and b2b-mp', () => {});

      return;
    }

    const merchantRelationshipCreatePage = container.get(MerchantRelationshipCreatePage);
    const productsPage = container.get(ProductsPage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let publishAndSyncCommands: string[];

    let staticFixtures: CustomerSpecificPricesStaticFixtures;
    let dynamicFixtures: CustomerSpecificPricesDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      // A tree-wide publish times the gateway out, so this stays narrowed to the product under test.
      publishAndSyncCommands = [
        `console publish:trigger-events -r product_abstract -i ${dynamicFixtures.merchantProduct.fk_product_abstract}`,
        `console publish:trigger-events -r price_product_abstract -i ${dynamicFixtures.merchantProduct.fk_product_abstract}`,
        'console queue:worker:start --stop-when-empty',
      ];

      // There is no dynamic-fixture helper for a merchant relation, so the back office creates it.
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      merchantRelationshipCreatePage.visit();
      merchantRelationshipCreatePage.create({
        idMerchant: dynamicFixtures.merchant.id_merchant,
        idCompany: dynamicFixtures.company.id_company,
        idCompanyBusinessUnit: dynamicFixtures.businessUnit.id_company_business_unit,
      });
    });

    it('given a merchant relation to a business unit when the merchant prices a product for it then only that business unit is charged that price, and deleting the row restores the default one', (): void => {
      // Arrange
      const abstractSku = dynamicFixtures.merchantProduct.abstract_sku;

      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      // Act
      productsPage.openProduct({ query: abstractSku });
      productsPage.addPriceRow({
        customerBusinessUnitName: dynamicFixtures.businessUnit.name,
        storeName: staticFixtures.storeName,
        currency: staticFixtures.currency,
        netAmount: staticFixtures.customerPrice.netAmount,
        grossAmount: staticFixtures.customerPrice.grossAmount,
      });

      cy.runCliCommands(publishAndSyncCommands);

      // Assert
      customerLoginScenario.execute({
        email: dynamicFixtures.companyCustomer.email,
        password: staticFixtures.defaultPassword,
      });
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: abstractSku });
      productPage.getProductDetailPrice().should('contain', staticFixtures.customerPrice.displayed);

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: abstractSku });
      productPage.getProductDetailPrice().should('contain', staticFixtures.defaultPrice);

      // Act
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });
      productsPage.openProduct({ query: abstractSku });
      productsPage.deletePriceRowByCustomer({ customerBusinessUnitName: dynamicFixtures.businessUnit.name });

      cy.runCliCommands(publishAndSyncCommands);

      // Assert
      customerLoginScenario.execute({
        email: dynamicFixtures.companyCustomer.email,
        password: staticFixtures.defaultPassword,
      });
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: abstractSku });
      productPage.getProductDetailPrice().should('contain', staticFixtures.defaultPrice);
    });
  }
);
