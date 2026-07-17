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

  getPageTitleText = (): string => 'Quick Order';

  getImageToCartTitleText = (): string => 'Add to cart from image';

  getBrowseFileText = (): string => 'Browse file';

  getUploadButtonText = (): string => 'Upload';

  getImageUploadInputName = (): string => 'image_order_form[uploadImageOrder]';

  getAcceptedImageMimeTypes = (): string => 'image/jpeg,image/jpg,image/png';

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

  getQuickOrderRowsSelector = (): string => '.js-quick-order-form__rows';

  getRecognizedSkuInputSelector = (): string =>
    '.js-quick-order-form__rows [data-qa="component product-search-autocomplete-form"] .js-product-search-autocomplete-form__input-hidden';
}
