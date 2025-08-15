import { container } from '@utils';
import { MerchantUserLoginScenario, MerchantStartDataImportScenario } from '@scenarios/mp';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ActionEnum, ProductManagementListPage } from '@pages/backoffice';
import { MerchantCombinedProductDynamicFixtures, MerchantCombinedProductStaticFixtures } from '@interfaces/mp';
import { CatalogPage } from '@pages/yves';
import { DataImportEntityTypeEnum, DataImportHistoryPage, DataImportStatusEnum } from '@pages/mp';

(['suite', 'b2b-mp', 'b2c-mp'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'merchant combined product',
  { tags: ['@mp', '@data-import'] },
  (): void => {
    const dataImportHistoryPage = container.get(DataImportHistoryPage);
    const catalogPage = container.get(CatalogPage);
    const merchantStartDataImportScenario = container.get(MerchantStartDataImportScenario);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const productManagementListPage = container.get(ProductManagementListPage);

    let dynamicFixtures: MerchantCombinedProductDynamicFixtures;
    let staticFixtures: MerchantCombinedProductStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    it('merchant can import a combined product and access its PDP', (): void => {
      const repositoryId = Cypress.env('repositoryId');

      cy.readFile('cypress/fixtures/' + repositoryId + '/mp/data-import/one_merchant_combined_product.csv').then(
        (content) => {
          const timestamp: number = Date.now();
          const abstractSku: string = 'PRODUCT-' + timestamp;
          const fileName = 'merchant_combined_product.csv';
          const file = merchantStartDataImportScenario.prepareFileByContent(fileName, content);

          // Start import in Merchant Portal
          merchantUserLoginScenario.execute({
            username: dynamicFixtures.merchantUser.username,
            password: staticFixtures.defaultPassword,
          });
          merchantStartDataImportScenario.execute({
            entityType: DataImportEntityTypeEnum.merchantCombinedProduct,
            file: file,
          });

          cy.runCliCommands(['console merchant-portal:file-import']);

          cy.reload();
          dataImportHistoryPage.assertFileStatus(fileName, DataImportStatusEnum.successful);

          // Approve product in the backoffice
          userLoginScenario.execute({
            username: dynamicFixtures.rootUser.username,
            password: staticFixtures.defaultPassword,
          });
          productManagementListPage.visit();
          productManagementListPage.update({ query: abstractSku, action: ActionEnum.approve });
          cy.contains('The approval status was updated');
          cy.runCliCommands(['console queue:worker:start --stop-when-empty']);

          // Check that product is accessible in Storefront
          catalogPage.visit();
          catalogPage.searchProductFromSuggestions({ query: abstractSku });
          cy.contains(abstractSku);
        }
      );
    });

    it('merchant will see failed data import status when uploaded with with invalid data', () => {
      const repositoryId = Cypress.env('repositoryId');

      cy.readFile('cypress/fixtures/' + repositoryId + '/mp/data-import/failed_merchant_combined_product.csv').then(
        (content) => {
          const fileName = 'failed_merchant_combined_product.csv';
          const file = merchantStartDataImportScenario.prepareFileByContent(fileName, content);

          // Start import in Merchant Portal
          merchantUserLoginScenario.execute({
            username: dynamicFixtures.merchantUser.username,
            password: staticFixtures.defaultPassword,
          });
          merchantStartDataImportScenario.execute({
            entityType: DataImportEntityTypeEnum.merchantCombinedProduct,
            file: file,
          });

          cy.runCliCommands(['console merchant-portal:file-import']);

          cy.reload();
          dataImportHistoryPage.assertFileStatus(fileName, DataImportStatusEnum.failed);
        }
      );
    });
  }
);
