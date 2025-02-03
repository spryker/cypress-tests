import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired

export class FileManagerAttachmentViewRepository {
    getFileNameSelector = (): string => '[data-qa="file-name"]';
    getUploadedDateSelector = (): string => '[data-qa="uploaded-date"]';
    getFileSizeSelector = (): string => '[data-qa="file-size"]';
    getFileTypeSelector = (): string => '[data-qa="file-type"]';
    getLinkedEntitiesSelector = (): string => '[data-qa="linked-entities"]';
}
