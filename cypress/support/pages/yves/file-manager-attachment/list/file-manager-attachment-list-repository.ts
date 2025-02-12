import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired
export class FileManagerAttachmentListRepository {
    getFitersSelector = (): string => '[data-qa="component filters"]';
    getFileTableSelector = (): string => '[data-qa="component view-table"]';
    getFileNameHeaderSelector = (): string => '[data-qa="name"]';
    getUploadedDateHeaderSelector = (): string => '[data-qa="date"]';
    getFileSizeHeaderSelector = (): string => '[data-qa="size"]';
    getFileTypeHeaderSelector = (): string => '[data-qa="type"]';
    getDownloadButtonSelector = (): string => '[data-qa="download-button"]';
}
