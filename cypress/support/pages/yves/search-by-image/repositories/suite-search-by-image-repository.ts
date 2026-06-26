import { injectable } from 'inversify';
import { SearchByImageRepository } from '../search-by-image-repository';

/**
 * Selectors for the AI Commerce "Search by Image" molecule injected into the storefront search bar
 * by `ImageSearchAiWidget` (rendered through the project override
 * `src/Demo/Yves/AiCommerce/Theme/default/components/molecules/search-by-image/search-by-image.twig`
 * and the search-form include point `src/Demo/Yves/ShopUi/.../search-form/search-form.twig`).
 *
 * The molecule renders only when `AiCommerceConfig::isSearchByImageEnabled()` is true, which reads
 * the dynamic configuration key `ai_commerce:search_by_image:search_by_image:enabled` (default OFF).
 * Enabling is done through the core Configuration Management screen — that screen exposes few
 * `data-qa` hooks, so the enable toggle uses the stable `.setting-row[data-setting-key="…"]` contract
 * and the `[data-qa="save-configuration"]` action (same pattern as the Smart CMS / Backoffice
 * Assistant page objects):
 *   vendor/spryker/configuration/.../Presentation/Manage/_partials/setting-row.twig
 *
 * The molecule's trigger buttons use the BEM `jsName` (`js-search-by-image`) variant — verified live
 * (`{{ config.jsName }}__btn-search-by-file`). The file input and CSRF token carry BOTH the `name`
 * and `jsName` classes, so the `search-by-image__*` (name) classes match them. The search bar renders
 * the molecule multiple times (desktop header, mobile header, side drawer); the file button is
 * visible only in the desktop header, while the photo button is `is-hidden` on desktop by design.
 */
@injectable()
export class SuiteSearchByImageRepository implements SearchByImageRepository {
  private static readonly ENABLE_SETTING_KEY = 'ai_commerce:search_by_image:search_by_image:enabled';

  getEnableToggleSelector = (): string =>
    `.setting-row[data-setting-key="${SuiteSearchByImageRepository.ENABLE_SETTING_KEY}"] .config-input`;

  getSaveButtonSelector = (): string => '[data-qa="save-configuration"]';

  getWrapperSelector = (): string => '.search-form__search-by-image';

  getFileButtonSelector = (): string => '.js-search-by-image__btn-search-by-file';

  getPhotoButtonSelector = (): string => '.js-search-by-image__btn-search-by-photo';

  getFileInputSelector = (): string => '.search-by-image__file-input';

  getTokenSelector = (): string => '.search-by-image__token';
}
