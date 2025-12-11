import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { DataExportMerchantFileRepository } from './data-export-merchant-file-repository';
import { MpPage } from '../mp-page';

@injectable()
@autoWired
export class DataExportMerchantFilePage extends MpPage {
  @inject(DataExportMerchantFileRepository) private readonly repository: DataExportMerchantFileRepository;

  PAGE_URL = '/data-export-merchant-portal-gui/files';

  searchInTable(query: string): void {
    this.repository.getTableSearchInput().type(query);
  }

  openFormDrawer(): void {
    this.repository.getStartExportButton().click();
  }

  exportFile(exporterType: string, additionalOptions?: Record<string, unknown>): void {
    this.repository.getEntityTypeSelect().select(exporterType, { force: true });

    if (additionalOptions && additionalOptions.includeProductAttributes) {
      this.repository.getIncludeProductAttributesCheckbox().check({ force: true });
    }

    this.repository.getFormSubmitButton().click();
  }

  assertTableIsVisible(): void {
    this.repository.getTable().should('be.visible');
  }

  assertExportButtonIsVisible(): void {
    this.repository.getStartExportButton().should('be.visible');
  }

  assertExportStartedNotification(): void {
    cy.get('body').should('contain', 'File export has been started');
  }

  assertExportStatus(status: string): void {
    cy.get('table').get('tbody').get('tr:first-child').contains(status);
  }
}
