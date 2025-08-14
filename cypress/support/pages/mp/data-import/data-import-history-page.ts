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
    this.repository.getTableSearchInput().clear({ force: true }).type(query);
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
}

interface FormData {
  entityType: string;
  file: Cypress.FileReference;
}
