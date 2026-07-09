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

  getOuterCategorySelectSelector = (): string => '.js-ai-categories select';

  getCategorySelectOptionSelector = (): string => '.js-ai-category-select option';

  getAltTextInputSelector = (): string => '.js-ai-alt-text-input';

  getImageRowAltTextFieldSelector = (): string => '[name*="[alt_text_small]"], [name*="[alt_text_large]"]';

  getInformationalFieldSelector = (): string => '.js-infomational-field';

  getImageUrlFieldSelector = (): string => '[name*="[external_url_small]"], [name*="[external_url_large]"]';

  getOpenPopoverState = (): string => ':popover-open';

  getResponsePopoverSelector = (): string => '.response-popover';

  getResponseFieldSelector = (): string => '#response-field';

  getOriginalFieldSelector = (): string => '#original-field';

  getResponseErrorBlockSelector = (): string => '.js-ai-product-management-modal__error-block';

  getClosePopoverButtonSelector = (): string => '[data-close-popover]';

  getResponseAgainButtonSelector = (): string => '.js-ai-builder-again';

  getResponseApplyButtonSelector = (): string => '.js-ai-builder-apply';

  getModalErrorHolderSelector = (): string => '.js-ai-product-management-modal__error';

  getModalAgainButtonSelector = (): string => '.js-ai-product-management-again';

  getModalApplyButtonSelector = (): string => '.js-ai-product-management-apply';

  getImageAltTextWrapperSelector = (): string => '.js-image-alt-text-wrapper';

  getAltTriggerTemplateSelector = (): string => '#ai-alt-text-trigger-template';

  getAffixClass = (): string => 'form-wrapper-clickable-affix';

  getContentImproverPath = (): string => '/ai-commerce/content-improver';

  getCategorySuggestionPath = (): string => '/ai-commerce/category-suggestion';

  getImageAltTextPath = (): string => '/ai-commerce/image-alt-text';

  getTranslatePath = (): string => '/ai-commerce/translate';
}
