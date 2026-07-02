import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class SmartCmsRepository {
  private static readonly ENABLE_SETTING_KEY = 'ai_commerce:smart_cms:general:is_enabled';

  getEnableToggleSelector = (): string =>
    `.setting-row[data-setting-key="${SmartCmsRepository.ENABLE_SETTING_KEY}"] .config-input`;

  getSaveButtonSelector = (): string => '[data-qa="save-configuration"]';

  getPanelSelector = (): string => '.js-smart-cms-panel';

  getPanelToggleSelector = (): string => '.js-smart-cms-panel__toggle';

  getPanelInputSelector = (): string => '.js-smart-cms-panel__input';

  getPanelAskSelector = (): string => '.js-smart-cms-panel__ask';

  getPanelAttachSelector = (): string => '.js-smart-cms-panel__attach';
}
