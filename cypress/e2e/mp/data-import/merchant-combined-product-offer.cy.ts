import { container } from '@utils';
import { MerchantUserLoginScenario, UploadProductOfferDataImportMerchantFileScenario } from '@scenarios/mp';
import { UserLoginScenario } from '@scenarios/backoffice';
import {
  MerchantCombinedProductOfferDynamicFixtures,
  MerchantCombinedProductOfferStaticFixtures,
} from '@interfaces/mp';
import { DataImportMerchantFilePage } from '@pages/mp';

(['suite', 'b2b-mp', 'b2c-mp'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'merchant combined product offer',
  { tags: ['@mp', '@data-import'] },
  (): void => {
    const dataImportMerchantFilePage = container.get(DataImportMerchantFilePage);
    const uploadProductOfferDataImportMerchantFileScenario = container.get(
      UploadProductOfferDataImportMerchantFileScenario
    );
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);

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
      const fileName = 'one_merchant_product_offer.csv';
      uploadProductOfferDataImportMerchantFileScenario.execute({
        importerType: 'Product offer',
        fileName: fileName,
        warehouseName: dynamicFixtures.stock.name || '',
      });

      dataImportMerchantFilePage.visit();
      dataImportMerchantFilePage.assertFileStatus(fileName, 'Successful');

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('merchant will see failed data import status when uploaded with with invalid data', () => {
      const fileName = 'failed_merchant_product_offer.csv';
      uploadProductOfferDataImportMerchantFileScenario.execute({
        importerType: 'Product offer',
        fileName: fileName,
        warehouseName: dynamicFixtures.stock.name || '',
      });

      dataImportMerchantFilePage.visit();
      dataImportMerchantFilePage.assertFileStatus(fileName, 'Failed');
    });
  }
);
