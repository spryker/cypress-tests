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
}
