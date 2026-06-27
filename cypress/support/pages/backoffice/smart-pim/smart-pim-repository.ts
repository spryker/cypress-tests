import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class SmartPimRepository {
  getRequestBuilderTriggerSelector = (): string => '.ai-query-builder__trigger';

  getCategoryTriggerSelector = (): string => '.js-ai-category-trigger';

  getAltImageTriggerSelector = (): string => '.js-ai-alt-image-trigger';

  getCategoryModalSelector = (): string => '#ai-category-modal';

  getAltTextModalSelector = (): string => '#ai-alt-text-modal';

  getTranslationModalSelector = (): string => '#ai-translation-modal';

  getAllActionsPopoverSelector = (): string => '.all-ai-actions-popover';

  getLocaleSelectorPopoverSelector = (): string => '.locale-selector-popover';

  getSmartPimScriptSelector = (): string => 'script[src*="spryker-ai-commerce-smart-product-management.js"]';

  getRequestBuilderScriptSelector = (): string => 'script[src*="spryker-ai-commerce-request-builder.js"]';

  getTranslateActionButtonSelector = (): string =>
    '.all-ai-actions-popover .ai-query-builder__button[data-target-popover=".locale-selector-popover"]';

  getImproveContentButtonSelector = (): string =>
    '.all-ai-actions-popover .ai-query-builder__button[data-request-url="/ai-commerce/content-improver"]';

  getLocaleButtonSelector = (): string => '.locale-selector-popover .ai-query-builder__button[data-locale]';

  getModalEmptyTextSelector = (): string => '.ai-product-management-modal__empty';

  getCategorySelectSelector = (): string => '.js-ai-category-select';

  getAltTextInputSelector = (): string => '.js-ai-alt-text-input';

  getInformationalFieldSelector = (): string => '.js-infomational-field';

  getImageUrlFieldSelector = (): string => '[name*="[external_url_small]"], [name*="[external_url_large]"]';

  getOpenPopoverState = (): string => ':popover-open';
}
