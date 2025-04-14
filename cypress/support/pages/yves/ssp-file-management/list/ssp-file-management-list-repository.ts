import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired
export class SspFileManagementListRepository {
  getFiltersSelector = (): string => '[data-qa="component filters"]';
  getFileTableSelector = (): string => '[data-qa="component advanced-table"]';
  getFileNameHeaderSelector = (): string => '[data-qa="name"]';
  getUploadedDateHeaderSelector = (): string => '[data-qa="date"]';
  getFileSizeHeaderSelector = (): string => '[data-qa="size"]';
  getFileTypeHeaderSelector = (): string => '[data-qa="type"]';
  getDownloadButtonSelector = (): string => '[data-qa="download-button"]';
  getTypeFilterSelector = (): string => '[data-qa="filter-type"]';
  getApplyFiltersButtonSelector = (): string => '[data-qa="submit-filters"]';
  getSearchFieldSelector = (): string => '[data-qa="search"]';
}
