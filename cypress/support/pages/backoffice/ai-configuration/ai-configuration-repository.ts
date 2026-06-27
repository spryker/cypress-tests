import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AiConfigurationRepository {
  getCardTitleSelector = (): string => '.configuration-management .card-title';

  getFeatureNavSelector = (feature: string): string => `.feature-header[data-feature="${feature}"]`;

  getTabNavSelector = (feature: string, tab: string): string =>
    `.feature-tabs__item[data-feature="${feature}"][data-tab="${tab}"]`;

  getSaveButtonSelector = (): string => '[data-qa="save-configuration"]';

  getSaveBarSelector = (): string => '#config-save-bar';

  getChangesCountSelector = (): string => '#changes-count';

  getSettingRowSelector = (settingKey: string): string => `.setting-row[data-setting-key="${settingKey}"]`;

  getSettingInputSelector = (settingKey: string): string =>
    `.setting-row[data-setting-key="${settingKey}"] .config-input`;

  getJsonEditorSelector = (settingKey: string): string => `.setting-row[data-setting-key="${settingKey}"] .json-editor`;

  getRadioOptionSelector = (settingKey: string): string =>
    `.setting-row[data-setting-key="${settingKey}"] input[type="radio"]`;

  getRadioOptionByValueSelector = (settingKey: string, value: string): string =>
    `.setting-row[data-setting-key="${settingKey}"] input[type="radio"][value="${value}"]`;
}
