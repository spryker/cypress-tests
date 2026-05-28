import { injectable } from 'inversify';
import { BackofficePage } from '../../backoffice-page';
import { CreateRunRepository } from './create-run-repository';

@injectable()
export class CreateRunPage extends BackofficePage {
  protected PAGE_URL = '/import-gui/create-run';

  constructor(private readonly repository: CreateRunRepository) {
    super();
  }

  downloadCsvTemplate = (): void => {
    this.visit();
    cy.get(this.repository.getDownloadCsvTemplateButtonSelector()).click();
  };

  uploadAndQueueImport = (fixturePath: string): void => {
    this.visit();

    cy.get(this.repository.getChooseFileSelector()).selectFile(`cypress/fixtures/${fixturePath}`, {
      force: true,
    });

    this.repository.getUploadAndQueueImportButtonSelector().click();
  };
}
