import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired
export class FileManagerAttachmentListRepository {
  getDeleteButtonSelector = (): string => '[data-qa="delete-button"]';
  getViewButtonSelector = (): string => '[data-qa="view-button"]';
  getReferenceHeaderSelector = (): string => '[data-qa="spy_file.file_reference"]';
  getFileNameHeaderSelector = (): string => '[data-qa="spy_file.file_name"]';
  getUploadedDateHeaderSelector = (): string => '[data-qa="created_at"]';
  getFileSizeHeaderSelector = (): string => '[data-qa="size"]';
  getFileTypeHeaderSelector = (): string => '[data-qa="type"]';
  getAttachButtonSelector = (): string => '[data-qa="attach-button"]';
}
