import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired
export class SspFileManagementAddRepository {
  getFileInputSelector = (): string => '[data-qa="file-upload-button"]';
  getSubmitButtonSelector = (): string => '[data-qa="file-upload-submit"]';
  getSuccessMessageSelector = (): string => '[data-qa="success-message"]';
}
