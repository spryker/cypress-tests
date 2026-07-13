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

  /**
   * Selects every field row belonging to a settings group on the current tab (e.g. `system_prompts`), matched on the
   * middle segment of the `data-setting-key` (`<feature>:<tab>:<group>:<field>`). Filters to rows that actually carry a
   * `.config-input` so non-field marker rows sharing the key are excluded from the count.
   */
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
