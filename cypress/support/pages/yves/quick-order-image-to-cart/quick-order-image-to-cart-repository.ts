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

  getImageToCartSectionSelector = (): string => '[data-qa="component quick-order-visual-add-to-cart"]';

  getImageToCartTitleSelector = (): string => '.quick-order-visual-add-to-cart__title';

  getSupportedFormatsDescriptionSelector = (): string => '[data-qa="quick-order-visual-add-to-cart-description"]';

  getPdfFormatText = (): string => 'PDF';

  getPageTitleText = (): string => 'Quick Order';

  getImageToCartTitleText = (): string => 'Add to cart from image';

  getBrowseFileText = (): string => 'Browse file';

  getUploadButtonText = (): string => 'Upload';

  getImageUploadInputName = (): string => 'visual_add_to_cart_form[orderFile]';

  getAcceptedFileMimeTypes = (): string => 'image/jpeg,image/jpg,image/png,application/pdf';

  getImageUploadInputSelector = (): string => '#visual_add_to_cart_form_orderFile';

  getBrowseFileLabelSelector = (): string => 'label[for="visual_add_to_cart_form_orderFile"]';

  getUploadSubmitButtonSelector = (): string => 'button[name="uploadOrderFile"]';

  getImageOrderCsrfTokenSelector = (): string => 'input[name="visual_add_to_cart_form[_token]"]';

  getFileSelectLabelSelector = (): string =>
    '[data-qa="component quick-order-visual-add-to-cart"] .quick-order-visual-add-to-cart__file-select';

  getFileSelectErrorSelector = (): string =>
    '[data-qa="component quick-order-visual-add-to-cart"] .quick-order-visual-add-to-cart__file-select--error';

  getBrowseFileToggleLabelSelector = (): string =>
    '[data-qa="component quick-order-visual-add-to-cart"] .js-quick-order-visual-add-to-cart__browse-file';

  getRemoveFileIconSelector = (): string =>
    '[data-qa="component quick-order-visual-add-to-cart"] .js-quick-order-visual-add-to-cart__remove-file';

  getErrorDropzoneSelector = (): string =>
    '[data-qa="component quick-order-visual-add-to-cart"] .input-dropzone--error';

  getErrorMessageSelector = (): string =>
    '[data-qa="component quick-order-visual-add-to-cart"] :is(.list--error, .list--alert) .list__item';

  getQuickOrderRowsSelector = (): string => '.js-quick-order-form__rows';

  getRecognizedSkuInputSelector = (): string =>
    '.js-quick-order-form__rows [data-qa="component product-search-autocomplete-form"] .js-product-search-autocomplete-form__input-hidden';
}
