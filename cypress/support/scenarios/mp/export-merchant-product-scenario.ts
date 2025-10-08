import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { DataExportMerchantFilePage } from '@pages/mp';

@injectable()
@autoWired
export class ExportMerchantProductScenario {
  @inject(DataExportMerchantFilePage) private readonly dataExportMerchantFilePage: DataExportMerchantFilePage;

  execute = (params: ExecuteParams): void => {
    this.dataExportMerchantFilePage.visit();
    this.dataExportMerchantFilePage.assertExportButtonIsVisible();
    this.dataExportMerchantFilePage.assertTableIsVisible();
    this.dataExportMerchantFilePage.openFormDrawer();
    this.dataExportMerchantFilePage.exportFile(params.exporterType, params.additionalOptions);

    this.dataExportMerchantFilePage.assertExportStartedNotification();
    cy.reload();
    this.dataExportMerchantFilePage.assertExportStatus('Pending');

    // Wait for export to complete
    cy.runCliCommands(['console data-export-merchant:export']);
    cy.reload();
    this.dataExportMerchantFilePage.assertExportStatus('Successful');
  };
}

interface ExecuteParams {
  exporterType: string;
  additionalOptions?: Record<string, unknown>;
}
