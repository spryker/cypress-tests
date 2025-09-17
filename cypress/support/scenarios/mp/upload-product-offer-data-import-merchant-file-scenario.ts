import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { DataImportMerchantFilePage } from '@pages/mp';
import { Merchant, ProductConcrete, Stock } from '../../types/mp/shared';

@injectable()
@autoWired
export class UploadProductOfferDataImportMerchantFileScenario {
  @inject(DataImportMerchantFilePage) private readonly dataImportMerchantFilePage: DataImportMerchantFilePage;

  execute = (params: ExecuteParams): string => {
    const repositoryId = Cypress.env('repositoryId');
    const uniqueIdentifier = String(Date.now());
    const productOfferReference = 'OFFER-' + uniqueIdentifier;
    const warehouseName: string | null = getDefaultWarehouseName(params);
    const productSku: string | null = getProductSku(params);

    cy.readFile('cypress/fixtures/' + repositoryId + `/mp/data-import/${params.fileName}`).then((content) => {
      content = content.replaceAll('{UNIQUE}', uniqueIdentifier);

      if (productSku) {
        content = content.replaceAll('{PRODUCT_SKU}', productSku);
      }

      if (warehouseName) {
        content = content.replaceAll('{WAREHOUSE_NAME}', warehouseName);
      }

      const file = {
        fileName: params.fileName,
        contents: Cypress.Buffer.from(content),
        mimeType: 'text/csv',
      };

      this.dataImportMerchantFilePage.visit();
      this.dataImportMerchantFilePage.openFormDrawer();
      this.dataImportMerchantFilePage.importFile('Product offer', file);

      this.dataImportMerchantFilePage.assertImportStartedNotification();
      this.dataImportMerchantFilePage.assertFileStatus(<string>params.fileName, 'Pending');

      cy.runCliCommands(['console data-import-merchant:import']);
    });

    return productOfferReference;
  };
}

function getDefaultWarehouseName(params: ExecuteParams): string | null {
  if (params.merchant === undefined) {
    return null;
  }

  const merchantFirstStock: Stock | undefined = params.merchant.stocks.shift();

  if (merchantFirstStock === undefined) {
    return null;
  }

  return merchantFirstStock.name;
}

function getProductSku(params: ExecuteParams): string | null {
  if (params.product === undefined) {
    return null;
  }

  return params?.product.sku;
}

interface ExecuteParams {
  fileName: string;
  merchant?: Merchant;
  product?: ProductConcrete;
}
