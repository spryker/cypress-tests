import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class SearchByImageRepository {
  private static readonly ENABLE_SETTING_KEY = 'ai_commerce:search_by_image:search_by_image:enabled';

  getEnableToggleSelector = (): string =>
    `.setting-row[data-setting-key="${SearchByImageRepository.ENABLE_SETTING_KEY}"] .config-input`;

  getSaveButtonSelector = (): string => '[data-qa="save-configuration"]';

  getWrapperSelector = (): string => '.search-form__search-by-image';

  getFileButtonSelector = (): string => '.js-search-by-image__btn-search-by-file';

  getPhotoButtonSelector = (): string => '.js-search-by-image__btn-search-by-photo';

  getFileInputSelector = (): string => '.search-by-image__file-input';

  getTokenSelector = (): string => '.search-by-image__token';

  getDesktopInstanceSelector = (): string => '.js-search-by-image--desktop';

  getOpenFilePopupSelector = (): string => '.search-by-image__search-by-file-popup.main-popup--open';

  getUploadFileButtonSelector = (): string => '.js-search-by-file-image__upload-file-button';

  // A search-results SURFACE that is present whether or not the search matched any products: a product
  // tile / product detail (matches found), OR the empty-catalog state, OR the search-results tabs shell.
  // A real-provider image search — especially the synthetic probe under a given vendor — may legitimately
  // resolve to a search term with zero catalog matches, so asserting "landed on a results page" must not
  // require a product tile.
  getResultsPageSurfaceSelector = (): string =>
    '[data-qa="component product-item"], [data-qa="component product-detail"], [data-qa="component empty-catalog-state"], [data-qa="component search-tabs"]';

  getFilePopupErrorSelector = (): string => '.js-search-by-file-image__error';

  getFilePopupErrorItemSelector = (): string => '.js-search-by-file-image__error-text';

  getSearchByImageInstanceSelector = (): string => 'search-by-image';
}
