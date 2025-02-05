import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired
export class FileManagerAttachmentDeleteRepository {
  getDeleteConfirmButtonSelector = (): string => '[data-qa="delete-confirm-button"]';
  getSuccessMessageSelector = (): string => '[data-qa="success-message"]';
}
