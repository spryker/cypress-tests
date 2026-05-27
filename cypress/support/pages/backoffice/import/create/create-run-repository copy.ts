import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CreateRunRepository {
  getDownloadCsvTemplateButtonSelector = (): string => 'a:contains("Download CSV Template")';
  getUploadAndQueueImportButtonSelector = (): Cypress.Chainable => cy.get('input[type="submit"]');

  getChooseFileSelector = (): string => '#import_job_run_form_file';

  getModalFileInputSelector = (): string => '.js-file-input';

  getModalUploadSubmitSelector = (): string => '.js-file-upload-submit';

  getLogoHiddenValueInputSelector = (): string => '.js-file-setting-value';
}
