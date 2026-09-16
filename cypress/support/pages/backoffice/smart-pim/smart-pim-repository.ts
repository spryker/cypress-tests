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

  getResponseErrorBlockSelector = (): string => '.js-ai-product-management-modal__error-block';

  getClosePopoverButtonSelector = (): string => '[data-close-popover]';

  getResponseAgainButtonSelector = (): string => '.js-ai-builder-again';

  getResponseApplyButtonSelector = (): string => '.js-ai-builder-apply';

  getModalErrorHolderSelector = (): string => '.js-ai-product-management-modal__error';

  getModalApplyButtonSelector = (): string => '.js-ai-product-management-apply';

  getImageAltTextWrapperSelector = (): string => '.js-image-alt-text-wrapper';

  getAltTriggerTemplateSelector = (): string => '#ai-alt-text-trigger-template';

  getInjectedAltTriggerSelector = (): string => '.js-ai-alt-image-trigger';

  getAffixClass = (): string => 'form-wrapper-clickable-affix';

  getLoadingClass = (): string => 'is-loading';

  getEmptyClass = (): string => 'is-empty';

  getCategoryModalId = (): string => 'ai-category-modal';

  getContentImproverPath = (): string => '/ai-commerce/content-improver';

  getCategorySuggestionPath = (): string => '/ai-commerce/category-suggestion';

  getImageAltTextPath = (): string => '/ai-commerce/image-alt-text';

  getTranslatePath = (): string => '/ai-commerce/translate';

  getProviderEndpointGlobs = (): Array<string> =>
    [
      this.getContentImproverPath(),
      this.getCategorySuggestionPath(),
      this.getImageAltTextPath(),
      this.getTranslatePath(),
    ].map((path) => `**${path}`);

  getCategoryEmptyText = (): string => 'Please fill in the product name';

  getAltTextEmptyText = (): string => 'Please fill in the product image url';

  getProviderUnavailableMessage = (): string => 'AI provider unavailable';

  getMissingParamsMessage = (endpoint: 'content-improver' | 'image-alt-text' | 'translate'): string => {
    const messages = {
      'content-improver': 'Text is missing from request.',
      'image-alt-text': 'ImageUrl and/or target locale are missing from request.',
      translate: 'Text and/or target locales are missing from request.',
    };

    return messages[endpoint];
  };
}
