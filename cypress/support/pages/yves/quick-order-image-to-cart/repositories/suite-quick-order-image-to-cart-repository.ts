import { injectable } from 'inversify';
import { QuickOrderImageToCartRepository } from '../quick-order-image-to-cart-repository';

/**
 * Selectors for the AI Commerce "Quick Add by Image" control injected into the storefront
 * Quick Order page (`/quick-order`) by `AiCommerceQuickOrderImageToCartFormPlugin`.
 *
 * The control renders only when `AiCommerceConfig::isQuickOrderImageToCartEnabled()` is true, which
 * reads the dynamic configuration key `ai_commerce:quick_order:visual_add_to_cart:enabled` (default
 * OFF). Enabling is done through the core Configuration Management screen — that screen exposes few
 * `data-qa` hooks, so the enable toggle uses the stable `.setting-row[data-setting-key="…"]` contract
 * and the `[data-qa="save-configuration"]` action (same pattern as the Search by Image / Smart CMS /
 * Backoffice Assistant page objects):
 *   vendor/spryker/configuration/.../Presentation/Manage/_partials/setting-row.twig
 *   vendor/spryker-feature/ai-commerce/resources/configuration/ai_commerce.configuration.yml (quick_order > visual_add_to_cart > enabled, storefront: true)
 *
 * The custom element exposes a stable `data-qa` hook; the file input / submit button rely on the
 * Symfony form field ids/names (`ImageOrderForm::FIELD_UPLOAD_IMAGE_ORDER = 'uploadImageOrder'`,
 * `SUBMIT_BUTTON_UPLOAD_IMAGE = 'uploadImage'`), and the section title falls back to the molecule's
 * own class. See:
 *   vendor/spryker-feature/ai-commerce/.../QuickOrderImageToCart/Form/ImageOrderForm.php
 *   vendor/spryker-feature/ai-commerce/.../Theme/default/components/molecules/quick-order-image-to-cart/quick-order-image-to-cart.twig
 */
@injectable()
export class SuiteQuickOrderImageToCartRepository implements QuickOrderImageToCartRepository {
  private static readonly ENABLE_SETTING_KEY = 'ai_commerce:quick_order:visual_add_to_cart:enabled';

  getEnableToggleSelector = (): string =>
    `.setting-row[data-setting-key="${SuiteQuickOrderImageToCartRepository.ENABLE_SETTING_KEY}"] .config-input`;

  getSaveButtonSelector = (): string => '[data-qa="save-configuration"]';

  getPageTitleSelector = (): string => 'h1.page-info__title';

  getImageToCartSectionSelector = (): string => '[data-qa="component quick-order-image-to-cart"]';

  getImageToCartTitleSelector = (): string => '.quick-order-image-to-cart__title';

  getImageUploadInputSelector = (): string => '#image_order_form_uploadImageOrder';

  getBrowseFileLabelSelector = (): string => 'label[for="image_order_form_uploadImageOrder"]';

  getUploadSubmitButtonSelector = (): string => 'button[name="uploadImage"]';
}
