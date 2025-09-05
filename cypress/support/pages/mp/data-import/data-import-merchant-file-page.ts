import { MpPage } from '@pages/mp';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { DataImportMerchantFileRepository } from './data-import-merchant-file-repository';

@injectable()
@autoWired
export class DataImportMerchantFilePage extends MpPage {
  @inject(DataImportMerchantFileRepository) private readonly repository: DataImportMerchantFileRepository;

  PAGE_URL = '/data-import-merchant-portal-gui/files';

  searchInTable(query: string): void {
    this.repository.getTableSearchInput().type(query);
  }

  openFormDrawer(): void {
    this.repository.getStartImportButton().click();
  }

  importFile(importerType: string, file: Cypress.FileReferenceObject): void {
    this.repository.getEntityTypeSelect().select(importerType, { force: true });
    this.repository.getFileInput().selectFile(file);

    this.repository.getFormSubmitButton().click();
  }

  assertImportStartedNotification(): void {
    cy.get('body').should('contain', 'File import has been started');
  }

  assertFileStatus(fileName: string, status: string): void {
    this.searchInTable(fileName);
    cy.get('table').contains(status);
  }
}
