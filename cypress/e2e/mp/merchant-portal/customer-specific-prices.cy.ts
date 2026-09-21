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

    // A tree-wide publish times the gateway out, so this stays narrowed to what the journey reads.
    const publishAndSyncCommands = [
      'console publish:trigger-events -r product_abstract',
      'console publish:trigger-events -r price_product_abstract',
      'console queue:worker:start --stop-when-empty',
    ];

    let staticFixtures: CustomerSpecificPricesStaticFixtures;
    let dynamicFixtures: CustomerSpecificPricesDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a merchant relation to a business unit when the merchant prices a product for it then only that business unit is charged that price, and deleting the row restores the default one', (): void => {
      // Arrange
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

      // Act
      openMerchantProductInPortal();
      productsPage.addCustomerPriceRow({
        customerBusinessUnitName: dynamicFixtures.businessUnit.name,
        storeName: staticFixtures.storeName,
        currency: staticFixtures.currency,
        netAmount: staticFixtures.customerPrice.netAmount,
        grossAmount: staticFixtures.customerPrice.grossAmount,
      });

      cy.runCliCommands(publishAndSyncCommands);

      // Assert
      openProductDetailPageAs(dynamicFixtures.companyCustomer.email);
      productPage.getProductDetailPrice().should('contain', staticFixtures.customerPrice.displayed);

      openProductDetailPageAs(dynamicFixtures.customer.email);
      productPage.getProductDetailPrice().should('contain', staticFixtures.defaultPrice);

      // Act
      openMerchantProductInPortal();
      productsPage.deletePriceRowByCustomer({ customerBusinessUnitName: dynamicFixtures.businessUnit.name });

      cy.runCliCommands(publishAndSyncCommands);

      // Assert
      openProductDetailPageAs(dynamicFixtures.companyCustomer.email);
      productPage.getProductDetailPrice().should('contain', staticFixtures.defaultPrice);
    });

    function openMerchantProductInPortal(): void {
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      productsPage.visit();
      productsPage.find({ query: dynamicFixtures.merchantProduct.abstract_sku }).click();
    }

    function openProductDetailPageAs(email: string): void {
      customerLoginScenario.execute({ email: email, password: staticFixtures.defaultPassword });

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.merchantProduct.abstract_sku });
    }
  }
);
