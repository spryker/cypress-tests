import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { DataImportMerchantFilePage } from '@pages/mp';
import { Merchant } from '../../types/mp/shared';

@injectable()
@autoWired
export class UploadProductDataImportMerchantFileScenario {
  @inject(DataImportMerchantFilePage) private readonly dataImportMerchantFilePage: DataImportMerchantFilePage;

  execute = (params: ExecuteParams): string => {
    const repositoryId = Cypress.env('repositoryId');
    const uniqueIdentifier = String(Date.now());
    const abstractSku = 'PRODUCT-' + uniqueIdentifier;
    const warehouseName: string | null = getDefaultWarehouseName(params);

    cy.readFile('cypress/fixtures/' + repositoryId + `/mp/data-import/${params.fileName}`).then((content) => {
      if (warehouseName) {
        content = content.replaceAll('{WAREHOUSE_NAME}', warehouseName);
      }

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

function getDefaultWarehouseName(params: ExecuteParams): string | null {
  if (!params?.merchant?.stocks?.length) {
    return null;
  }

  return params.merchant.stocks[0].name;
}

interface ExecuteParams {
  fileName: string;
  importerType: string;
  merchant?: Merchant;
}
