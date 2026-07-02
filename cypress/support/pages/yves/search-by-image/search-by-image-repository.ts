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
}
