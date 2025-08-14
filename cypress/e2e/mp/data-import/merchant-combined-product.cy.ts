import { container } from '@utils';
import { MerchantUserLoginScenario } from '@scenarios/mp';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ActionEnum, ProductManagementListPage } from '@pages/backoffice';
import { MerchantCombinedProductDynamicFixtures, MerchantCombinedProductStaticFixtures } from '@interfaces/mp';
import { CatalogPage } from '@pages/yves';
import { DataImportHistoryPage } from '@pages/mp';

(['suite', 'b2b-mp', 'b2c-mp'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'merchant combined product',
  { tags: ['@mp', '@data-import'] },
  (): void => {
    const dataImportHistoryPage = container.get(DataImportHistoryPage);
    const catalogPage = container.get(CatalogPage);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const productManagementListPage = container.get(ProductManagementListPage);

    let dynamicFixtures: MerchantCombinedProductDynamicFixtures;
    let staticFixtures: MerchantCombinedProductStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    it('merchant can import a combined product', (): void => {
      const repositoryId = Cypress.env('repositoryId');

      cy.readFile('cypress/fixtures/' + repositoryId + '/mp/data-import/one_merchant_combined_product.csv').then(
        (contents) => {
          const timestamp: number = Date.now();
          const abstractSku: string = 'PRODUCT-' + timestamp;
          const fileName = 'merchant_combined_product.csv';

          contents = contents.replaceAll('{UNIQUE}', timestamp);

          const file: Cypress.FileReference = {
            fileName,
            contents: Cypress.Buffer.from(contents),
            mimeType: 'text/csv',
            lastModified: timestamp,
          };

          // Start import in Merchant Portal
          merchantUserLoginScenario.execute({
            username: dynamicFixtures.merchantUser.username,
            password: staticFixtures.defaultPassword,
          });
          dataImportHistoryPage.visit();
          dataImportHistoryPage.openFormDrawer();
          dataImportHistoryPage.fillForm({
            entityType: 'Product',
            file: file,
          });
          dataImportHistoryPage.submitForm();
          cy.get('body').should('contain', 'File import has been started');

          cy.runCliCommands(['console merchant-portal:file-import']);

          dataImportHistoryPage.searchInTable(fileName);
          cy.get('table').contains('Successful');

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
  }
);
