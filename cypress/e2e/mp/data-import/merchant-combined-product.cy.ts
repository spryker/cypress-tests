import { container } from '@utils';
import { MerchantUserLoginScenario } from '@scenarios/mp';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ActionEnum, ProductManagementListPage } from '@pages/backoffice';
import { MerchantCombinedProductDynamicFixtures, MerchantCombinedProductStaticFixtures } from '@interfaces/mp';
import { CatalogPage } from '@pages/yves';

(['suite', 'b2b-mp', 'b2c-mp'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'merchant combined product data import',
  { tags: ['@mp', '@data-import'] },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const productManagementListPage = container.get(ProductManagementListPage);

    let dynamicFixtures: MerchantCombinedProductDynamicFixtures;
    let staticFixtures: MerchantCombinedProductStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    it('merchant can start import', (): void => {
      const repositoryId = Cypress.env('repositoryId');

      cy.readFile('cypress/fixtures/' + repositoryId + '/mp/data-import/merchant_combined_product-1.csv').then(
        (contents) => {
          const timestamp: number = Date.now();
          const abstractSku: string = 'PRODUCT-' + timestamp;

          contents = contents.replaceAll('{UNIQUE}', timestamp);

          const file: Cypress.FileReference = {
            fileName: 'merchant_combined_product.csv',
            contents: Cypress.Buffer.from(contents),
            mimeType: 'text/csv',
            lastModified: timestamp,
          };

          // Start import in Merchant Portal
          merchantUserLoginScenario.execute({
            username: dynamicFixtures.merchantUser.username,
            password: staticFixtures.defaultPassword,
          });
          cy.visit('http://mp.eu.spryker.local/file-import-merchant-portal-gui/history');
          cy.contains('Start Import').click();
          cy.get('select[name="merchant_file_import_form[entity_type]"]').select('Product', { force: true });
          cy.get('input[name="merchant_file_import_form[merchantFile][file]"]').selectFile(file);
          cy.get('web-spy-button').contains('Import').click();
          cy.get('body').should('contain', 'File import has been started');

          cy.runCliCommands(['console merchant-portal:file-import']);

          // Approve product in the backoffice
          userLoginScenario.execute({
            username: dynamicFixtures.rootUser.username,
            password: staticFixtures.defaultPassword,
          });
          productManagementListPage.visit();
          productManagementListPage.update({ query: abstractSku, action: ActionEnum.approve });
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
