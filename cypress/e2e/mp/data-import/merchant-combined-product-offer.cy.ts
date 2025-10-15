import { container } from '@utils';
import { MerchantUserLoginScenario, UploadProductOfferDataImportMerchantFileScenario } from '@scenarios/mp';
import { UserLoginScenario, ApproveProductOfferScenario } from '@scenarios/backoffice';
import {
  MerchantCombinedProductOfferDynamicFixtures,
  MerchantCombinedProductOfferStaticFixtures,
} from '@interfaces/mp';
import { DataImportMerchantFilePage } from '@pages/mp';
import { CatalogPage, ProductPage } from '@pages/yves';

describe(
  'merchant combined product offer',
  {
    tags: [
      '@mp',
      '@data-import',
      'marketplace-product-offer',
      'marketplace-merchant-portal-product-offer-management',
      'merchant-portal-data-import',
      'search',
      'catalog',
      'self-service-portal',
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
    const productPage = container.get(ProductPage);
    const uploadProductOfferDataImportMerchantFileScenario = container.get(
      UploadProductOfferDataImportMerchantFileScenario
    );
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const approveProductOfferScenario = container.get(ApproveProductOfferScenario);

    let dynamicFixtures: MerchantCombinedProductOfferDynamicFixtures;
    let staticFixtures: MerchantCombinedProductOfferStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('merchant can import a product offer and access its PDP', (): void => {
      const fileName = 'one_merchant_combined_product_offer.csv';
      const productOfferReference = uploadProductOfferDataImportMerchantFileScenario.execute({
        fileName,
        merchant: dynamicFixtures.merchant,
        product: dynamicFixtures.product,
      });

      dataImportMerchantFilePage.visit();
      dataImportMerchantFilePage.assertFileStatus(fileName, 'Successful');

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      approveProductOfferScenario.execute({
        productOfferReference,
        shouldTriggerPublishAndSync: true,
      });
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
      productPage.getProductOfferRadio({ productOfferReference }).should('exist');
    });

    it('merchant will see failed data import status when uploaded with with invalid data', () => {
      const fileName = 'failed_merchant_combined_product_offer.csv';
      uploadProductOfferDataImportMerchantFileScenario.execute({
        fileName: fileName,
        product: dynamicFixtures.product,
      });

      dataImportMerchantFilePage.visit();
      dataImportMerchantFilePage.assertFileStatus(fileName, 'Failed');
    });
  }
);
