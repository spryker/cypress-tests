import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired
export class FileManagerAttachmentListRepository {
    getDropdownToggleButtonSelector = (): string => '[data-qa="spy-btn dropdown-toggle"]';
    getDropdownMenuSelector = (): string => '.dropdown-menu.show';
    getEditButtonSelector = (): string => '[data-qa="spy-btn edit-button"]';
    getDeleteButtonSelector = (): string => '[data-qa="spy-btn delete-button"]';
    getDownloadButtonSelector = (): string => '[data-qa="spy-btn download-button"]';
    getViewButtonSelector = (): string => '[data-qa="view-button"]';
    getTableSelector = (): string => '.gui-table-data';
    getTableWrapperSelector = (): string => '.dataTables_wrapper';
    getTableHeaderSelector = (): string => 'th';
}
