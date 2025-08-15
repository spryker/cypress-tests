import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import {
  DataImportEntityTypeEnum,
  DataImportHistoryPage,
  DataImportStatusEnum,
  getDataImportEntityTypeOptionLabel,
} from '@pages/mp';

@injectable()
@autoWired
export class MerchantStartDataImportScenario {
  @inject(DataImportHistoryPage) private readonly dataImportHistoryPage: DataImportHistoryPage;

  execute = (executeParams: ExecuteParams): void => {
    this.dataImportHistoryPage.visit();
    this.dataImportHistoryPage.openFormDrawer();
    this.dataImportHistoryPage.fillForm({
      entityType: getDataImportEntityTypeOptionLabel(executeParams.entityType),
      file: executeParams.file,
    });
    this.dataImportHistoryPage.submitForm();
    this.dataImportHistoryPage.assertImportStartedNotification();
    this.dataImportHistoryPage.assertFileStatus(<string>executeParams.file.fileName, DataImportStatusEnum.pending);
  };

  prepareFileByContent = (fileName: string, content: string): Cypress.FileReferenceObject => {
    const timestamp: number = Date.now();

    content = content.replaceAll('{UNIQUE}', String(timestamp));

    return {
      fileName,
      contents: Cypress.Buffer.from(content),
      mimeType: 'text/csv',
    };
  };
}

interface ExecuteParams {
  entityType: DataImportEntityTypeEnum;
  file: Cypress.FileReferenceObject;
}
