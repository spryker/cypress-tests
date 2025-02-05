import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired
export class FileManagerAttachmentDetachRepository {
  getDetachButtonSelector = (): string => '[data-qa="unlink-button"]';
  getSuccessMessageSelector = (): string => '[data-qa="success-message"]';
}
