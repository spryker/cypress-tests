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
}
