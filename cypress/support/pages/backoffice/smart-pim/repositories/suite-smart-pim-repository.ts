import { injectable } from 'inversify';
import { SmartPimRepository } from '../smart-pim-repository';

/**
 * The AiCommerce Smart Product Management partials expose no `data-qa` hooks, so these selectors
 * fall back to the stable class/id/attribute hooks the templates render directly. See:
 *   vendor/spryker-feature/ai-commerce/.../SmartProductManagement/_partials/ai-request-builder-button.twig
 *   vendor/spryker-feature/ai-commerce/.../SmartProductManagement/_partials/category-modal-trigger.twig
 *   vendor/spryker-feature/ai-commerce/.../SmartProductManagement/ProductManagement/_partials/image-alt-text.twig
 *   vendor/spryker-feature/ai-commerce/.../SmartProductManagement/_partials/product-management-ai-modals.twig
 *   vendor/spryker-feature/ai-commerce/.../SmartProductManagement/_partials/ai-request-builder-popovers.twig
 *
 * All of these render only when `AiCommerceConfig::isSmartProductManagementEnabled()` is true (the
 * `{% if isSmartProductManagementEnabled %}` template gate), which is ON in this build.
 */
@injectable()
export class SuiteSmartPimRepository implements SmartPimRepository {
  // Control 1 & 4 entry point — the AI icon button next to name/description fields.
  getRequestBuilderTriggerSelector = (): string => '.ai-query-builder__trigger';

  // Control 2 — category suggestion trigger (opens #ai-category-modal).
  getCategoryTriggerSelector = (): string => '.js-ai-category-trigger';

  // Control 3 — image alt-text trigger, JS-injected into each media wrapper on the Media tab.
  getAltImageTriggerSelector = (): string => '.js-ai-alt-image-trigger';

  getCategoryModalSelector = (): string => '#ai-category-modal';

  getAltTextModalSelector = (): string => '#ai-alt-text-modal';

  getTranslationModalSelector = (): string => '#ai-translation-modal';

  // Control 1 popover (the "Translate to" / "Improve content" choice menu).
  getAllActionsPopoverSelector = (): string => '.all-ai-actions-popover';

  // Control 4 popover (locale picker reached from "Translate to").
  getLocaleSelectorPopoverSelector = (): string => '.locale-selector-popover';

  getSmartPimScriptSelector = (): string => 'script[src*="spryker-ai-commerce-smart-product-management.js"]';

  getRequestBuilderScriptSelector = (): string => 'script[src*="spryker-ai-commerce-request-builder.js"]';
}
