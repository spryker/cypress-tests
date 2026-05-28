import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '../backoffice-page';
import { ExportRepository } from './export-repository';

@injectable()
@autoWired

export class ExportPage extends BackofficePage {
  @inject(ExportRepository) private repository: ExportRepository;

  protected PAGE_URL = '/product-experience-management/export';

    exportProducts(): void {
        this.repository.getExportButton().click();
    }

}

