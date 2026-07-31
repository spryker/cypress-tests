import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class BackofficeAssistantRepository {
  private static readonly ENABLE_SETTING_KEY = 'ai_commerce:backoffice_assistant:general:is_enabled';

  getEnableToggleSelector = (): string =>
    `.setting-row[data-setting-key="${BackofficeAssistantRepository.ENABLE_SETTING_KEY}"] .config-input`;

  getSaveButtonSelector = (): string => '[data-qa="save-configuration"]';

  getWidgetToggleSelector = (): string => '.js-backoffice-assistant__toggle';

  getWidgetPanelSelector = (): string => '.js-backoffice-assistant__panel';

  getWidgetAgentSelectSelector = (): string => '.js-backoffice-assistant__agent-select';

  getWidgetInputSelector = (): string => '.js-backoffice-assistant__input';

  getWidgetSendSelector = (): string => '.js-backoffice-assistant__send';

  getWidgetHistoryButtonSelector = (): string => '.js-backoffice-assistant__history-btn';

  getWidgetNewChatSelector = (): string => '.js-backoffice-assistant__new-chat';

  getWidgetAttachSelector = (): string => '.js-backoffice-assistant__attach';
}
