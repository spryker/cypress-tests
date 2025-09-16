import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { DataImportMerchantFilePage } from '@pages/mp';

@injectable()
@autoWired
export class UploadProductOfferDataImportMerchantFileScenario {
  @inject(DataImportMerchantFilePage) private readonly dataImportMerchantFilePage: DataImportMerchantFilePage;

  execute = (params: ExecuteParams): string => {
    const repositoryId = Cypress.env('repositoryId');
    const uniqueIdentifier = String(Date.now());
    const productOfferReference = 'OFFER-' + uniqueIdentifier;

    cy.readFile('cypress/fixtures/' + repositoryId + `/mp/data-import/${params.fileName}`).then((content) => {
      content = content
        .replaceAll('{UNIQUE}', uniqueIdentifier)
        .replaceAll('{WAREHOUSE_NAME}', params.warehouseName || '');

      const file = {
        fileName: params.fileName,
        contents: Cypress.Buffer.from(content),
        mimeType: 'text/csv',
      };

      this.dataImportMerchantFilePage.visit();
      this.dataImportMerchantFilePage.openFormDrawer();
      this.dataImportMerchantFilePage.importFile(params.importerType, file);

      this.dataImportMerchantFilePage.assertImportStartedNotification();
      this.dataImportMerchantFilePage.assertFileStatus(<string>params.fileName, 'Pending');

      cy.runCliCommands(['console data-import-merchant:import']);
    });

    return productOfferReference;
  };
}

interface ExecuteParams {
  fileName: string;
  importerType: string;
  warehouseName?: string;
}
