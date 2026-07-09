import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class QuickOrderImageToCartRepository {
  private static readonly ENABLE_SETTING_KEY = 'ai_commerce:quick_order:visual_add_to_cart:enabled';

  getEnableToggleSelector = (): string =>
    `.setting-row[data-setting-key="${QuickOrderImageToCartRepository.ENABLE_SETTING_KEY}"] .config-input`;

  getSaveButtonSelector = (): string => '[data-qa="save-configuration"]';

  getPageTitleSelector = (): string => 'h1.page-info__title';

  getImageToCartSectionSelector = (): string => '[data-qa="component quick-order-image-to-cart"]';

  getImageToCartTitleSelector = (): string => '.quick-order-image-to-cart__title';

  getImageUploadInputSelector = (): string => '#image_order_form_uploadImageOrder';

  getBrowseFileLabelSelector = (): string => 'label[for="image_order_form_uploadImageOrder"]';

  getUploadSubmitButtonSelector = (): string => 'button[name="uploadImage"]';

  getImageOrderCsrfTokenSelector = (): string => 'input[name="image_order_form[_token]"]';

  getFileSelectLabelSelector = (): string =>
    '[data-qa="component quick-order-image-to-cart"] .quick-order-image-to-cart__file-select';

  getFileSelectErrorSelector = (): string =>
    '[data-qa="component quick-order-image-to-cart"] .quick-order-image-to-cart__file-select--error';

  getBrowseFileToggleLabelSelector = (): string =>
    '[data-qa="component quick-order-image-to-cart"] .js-quick-order-image-to-cart__browse-file';

  getRemoveFileIconSelector = (): string =>
    '[data-qa="component quick-order-image-to-cart"] .js-quick-order-image-to-cart__remove-file';

  getErrorDropzoneSelector = (): string => '[data-qa="component quick-order-image-to-cart"] .input-dropzone--error';

  getErrorMessageSelector = (): string => '[data-qa="component quick-order-image-to-cart"] .list--alert .list__item';

  // The project-level quick-order-form override (src/Pyz/.../quick-order-form.twig) renders the rows
  // wrapper with only the `js-` prefixed class (`{{ embed.jsName }}__rows`), unlike the core component
  // which also emits `{{ embed.name }}__rows`. Target the class this project actually renders.
  getQuickOrderRowsSelector = (): string => '.js-quick-order-form__rows';

  // Each row's SKU search widget is the `product-search-autocomplete-form` custom element (not a
  // generic `autocomplete-form`); the recognized SKU is written into its hidden value input
  // (`js-product-search-autocomplete-form__input-hidden`), while the sibling visible text input only
  // holds the human-readable search string.
  getRecognizedSkuInputSelector = (): string =>
    '.js-quick-order-form__rows [data-qa="component product-search-autocomplete-form"] .js-product-search-autocomplete-form__input-hidden';
}
