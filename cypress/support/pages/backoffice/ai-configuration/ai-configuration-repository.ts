import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AiConfigurationRepository {
  getCardTitleSelector = (): string => '.configuration-management .card-title';

  getCardTitleText = (): string => 'Configuration Management';

  getVendorSettingKey = (vendor: string, field: string): string => `ai_vendor:${vendor}:general:${field}`;

  getApiTokenSettingInputSelector = (vendor: string): string =>
    this.getSettingInputSelector(this.getVendorSettingKey(vendor, 'api_token'));

  getModelPricesEditorSelector = (vendor: string): string =>
    this.getJsonEditorSelector(this.getVendorSettingKey(vendor, 'model_prices'));

  getFeatureVendorSettingKey = (feature: string): string => `ai_commerce:${feature}:ai_vendor:ai_configuration`;

  getFeatureVendorOptionValue = (feature: string, vendor: string): string =>
    `AI_COMMERCE:AI_CONFIGURATION_${feature.toUpperCase()}_${vendor.toUpperCase()}`;

  getFeatureNavSelector = (feature: string): string => `.feature-header[data-feature="${feature}"]`;

  getTabNavSelector = (feature: string, tab: string): string =>
    `.feature-tabs__item[data-feature="${feature}"][data-tab="${tab}"]`;

  getSaveButtonSelector = (): string => '[data-qa="save-configuration"]';

  getSaveBarSelector = (): string => '#config-save-bar';

  getChangesCountSelector = (): string => '#changes-count';

  getSettingRowSelector = (settingKey: string): string => `.setting-row[data-setting-key="${settingKey}"]`;

  getSettingRowsByGroupSelector = (groupKey: string): string =>
    `.setting-row[data-setting-key*=":${groupKey}:"]:has(.config-input)`;

  getSettingInputSelector = (settingKey: string): string =>
    `.setting-row[data-setting-key="${settingKey}"] .config-input`;

  getJsonEditorSelector = (settingKey: string): string => `.setting-row[data-setting-key="${settingKey}"] .json-editor`;

  getRadioOptionSelector = (settingKey: string): string =>
    `.setting-row[data-setting-key="${settingKey}"] input[type="radio"]`;

  getRadioOptionByValueSelector = (settingKey: string, value: string): string =>
    `.setting-row[data-setting-key="${settingKey}"] input[type="radio"][value="${value}"]`;
}
