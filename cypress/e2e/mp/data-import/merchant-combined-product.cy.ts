import { container } from '@utils';
import { MerchantUserLoginScenario, UploadProductDataImportMerchantFileScenario } from '@scenarios/mp';
import { ActivateProductScenario, UserLoginScenario } from '@scenarios/backoffice';
import { MerchantCombinedProductDynamicFixtures, MerchantCombinedProductStaticFixtures } from '@interfaces/mp';
import { CatalogPage, ProductPage } from '@pages/yves';
import { DataImportMerchantFilePage } from '@pages/mp';
import { CustomerLoginScenario } from '../../../support/scenarios/yves';

describe(
  'merchant combined product',
  {
    tags: [
      '@mp',
      '@data-import',
      'marketplace-product-offer',
      'marketplace-merchant-portal-product-offer-management',
      'merchant-portal-data-import',
      'product',
      'marketplace-product',
      'marketplace-merchant-portal-product-management',
      'search',
      'catalog',
      'marketplace-merchantportal-core',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2b-mp', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite, b2b-mp and b2c-mp', () => {});
      return;
    }
    const dataImportMerchantFilePage = container.get(DataImportMerchantFilePage);
    const catalogPage = container.get(CatalogPage);
    const uploadProductDataImportMerchantFileScenario = container.get(UploadProductDataImportMerchantFileScenario);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const activateProductScenario = container.get(ActivateProductScenario);
    const productPage = container.get(ProductPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let dynamicFixtures: MerchantCombinedProductDynamicFixtures;
    let staticFixtures: MerchantCombinedProductStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('merchant can import a combined product and access its PDP', (): void => {
      const fileName = 'one_merchant_combined_product.csv';
      const abstractSku = uploadProductDataImportMerchantFileScenario.execute({
        importerType: 'Product',
        fileName: fileName,
        merchant: dynamicFixtures.merchant,
      });

      dataImportMerchantFilePage.visit();
      dataImportMerchantFilePage.assertFileStatus(fileName, 'Successful');

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      activateProductScenario.execute({ abstractSku: abstractSku, shouldTriggerPublishAndSync: true });
      if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
        customerLoginScenario.execute({
          email: dynamicFixtures.customer.email,
          password: staticFixtures.defaultPassword,
        });
      }
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: abstractSku });
      cy.contains(abstractSku);
      productPage.getAddToCartButton().should('not.be.disabled');

      if (['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
        const merchantProduct = productPage.getSoldByProductOffers().children().first();
        productPage.getAvailabilityStatusBlock(merchantProduct).contains('Available');
      }
    });

    it('merchant will see failed data import status when uploaded with with invalid data', () => {
      const fileName = 'failed_merchant_combined_product.csv';
      uploadProductDataImportMerchantFileScenario.execute({
        importerType: 'Product',
        fileName: fileName,
        merchant: dynamicFixtures.merchant,
      });

      dataImportMerchantFilePage.visit();
      dataImportMerchantFilePage.assertFileStatus(fileName, 'Failed');
    });
  }
);
