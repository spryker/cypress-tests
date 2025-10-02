import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { DataImportMerchantFilePage } from '@pages/mp';

@injectable()
@autoWired
export class UploadProductDataImportMerchantFileScenario {
  @inject(DataImportMerchantFilePage) private readonly dataImportMerchantFilePage: DataImportMerchantFilePage;

  execute = (params: ExecuteParams): string => {
    const repositoryId = Cypress.env('repositoryId');
    const uniqueIdentifier = String(Date.now());
    const abstractSku = 'PRODUCT-' + uniqueIdentifier;

    cy.readFile('cypress/fixtures/' + repositoryId + `/mp/data-import/${params.fileName}`).then((content) => {
      const file = {
        fileName: params.fileName,
        contents: Cypress.Buffer.from(content.replaceAll('{UNIQUE}', uniqueIdentifier)),
        mimeType: 'text/csv',
      };

      this.dataImportMerchantFilePage.visit();
      this.dataImportMerchantFilePage.openFormDrawer();
      this.dataImportMerchantFilePage.importFile(params.importerType, file);

      this.dataImportMerchantFilePage.assertImportStartedNotification();
      this.dataImportMerchantFilePage.assertFileStatus(<string>params.fileName, 'Pending');

      cy.runCliCommands(['console data-import-merchant:import']);
    });

    return abstractSku;
  };
}

interface ExecuteParams {
  fileName: string;
  importerType: string;
}
