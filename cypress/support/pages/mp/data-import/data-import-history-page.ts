import { MpPage } from '@pages/mp';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { DataImportHistoryRepository } from './data-import-history-repository';

@injectable()
@autoWired
export class DataImportHistoryPage extends MpPage {
  @inject(DataImportHistoryRepository) private readonly repository: DataImportHistoryRepository;

  PAGE_URL = '/file-import-merchant-portal-gui/history';

  searchInTable(query: string): void {
    this.repository.getTableSearchInput().type(query);
  }

  openFormDrawer(): void {
    this.repository.getStartImportButton().click();
  }

  fillForm(data: FormData): void {
    this.repository.getEntityTypeSelect().select(data.entityType, { force: true });
    this.repository.getFileInput().selectFile(data.file);
  }

  submitForm(): void {
    this.repository.getFormSubmitButton().click();
  }

  assertImportStartedNotification(): void {
    cy.get('body').should('contain', 'File import has been started');
  }

  assertFileStatus(fileName: string, status: DataImportStatusEnum): void {
    this.searchInTable(fileName);
    cy.get('table').contains(getDataImportStatusLabel(status));
  }
}

export enum DataImportEntityTypeEnum {
  merchantCombinedProduct,
}

export enum DataImportStatusEnum {
  pending,
  successful,
  failed,
}

export function getDataImportEntityTypeOptionLabel(entityType: DataImportEntityTypeEnum): string {
  switch (entityType) {
    case DataImportEntityTypeEnum.merchantCombinedProduct:
      return 'Product';
    default:
      throw new Error(`Unknown entity type: ${entityType}`);
  }
}

function getDataImportStatusLabel(status: DataImportStatusEnum): string {
  switch (status) {
    case DataImportStatusEnum.pending:
      return 'Pending';
    case DataImportStatusEnum.successful:
      return 'Successful';
    case DataImportStatusEnum.failed:
      return 'Failed';
    default:
      throw new Error(`Unknown status: ${status}`);
  }
}

interface FormData {
  entityType: string;
  file: Cypress.FileReferenceObject;
}
