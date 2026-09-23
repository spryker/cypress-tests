import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '../../backoffice-page';
import { CreateRunRepository } from './create-run-repository';

@injectable()
@autoWired
export class CreateRunPage extends BackofficePage {
  @inject(CreateRunRepository) private repository: CreateRunRepository;

  protected PAGE_URL = '/product-experience-management/run/create';

  private buildUrl = (importJobReference: string): string =>
    `${this.PAGE_URL}?importJobReference=${encodeURIComponent(importJobReference)}`;

  createNewRun = (importJobReference: string): void => {
    cy.visitBackoffice(this.buildUrl(importJobReference));
  };

  downloadCsvTemplate = (): void => {
    cy.get(this.repository.getDownloadCsvTemplateButtonSelector()).click();
  };

  uploadAndQueueImport = (downloadedPath: string): void => {
    cy.get(this.repository.getChooseFileSelector()).selectFile(downloadedPath, {
      force: true,
    });

    this.repository.getUploadAndQueueImportButtonSelector().click();
  };
}
