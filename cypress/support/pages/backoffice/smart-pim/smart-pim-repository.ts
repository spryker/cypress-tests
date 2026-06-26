export interface SmartPimRepository {
  getRequestBuilderTriggerSelector(): string;
  getCategoryTriggerSelector(): string;
  getAltImageTriggerSelector(): string;
  getCategoryModalSelector(): string;
  getAltTextModalSelector(): string;
  getTranslationModalSelector(): string;
  getAllActionsPopoverSelector(): string;
  getLocaleSelectorPopoverSelector(): string;
  getSmartPimScriptSelector(): string;
  getRequestBuilderScriptSelector(): string;
}
