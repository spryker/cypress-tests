import { injectable } from 'inversify';
import { BackofficeAssistantRepository } from '../backoffice-assistant-repository';

/**
 * The Backoffice Assistant is a global Zed chat widget injected into every Back Office page via
 * `src/Demo/Zed/Gui/Presentation/Layout/layout.twig`, rendered only when the config flag
 * `ai_commerce:backoffice_assistant:general:is_enabled` is ON. The widget exposes stable
 * `js-backoffice-assistant__*` hook classes (the template's intended JS contract) rather than
 * `data-qa` attributes, so the widget selectors target those:
 *   vendor/spryker-feature/ai-commerce/.../Presentation/Partials/chat-widget.twig
 *
 * Enabling the flag is done through the core Configuration Management screen
 * (`@Configuration/Manage/index.twig`). That screen has few `data-qa` hooks, so the enable
 * toggle falls back to the stable `.setting-row[data-setting-key="…"]` contract (same pattern as
 * the AI Configuration page object) and the `[data-qa="save-configuration"]` action the template
 * does expose:
 *   vendor/spryker/configuration/.../Presentation/Manage/index.twig
 *   vendor/spryker/configuration/.../Presentation/Manage/_partials/setting-row.twig
 */
@injectable()
export class SuiteBackofficeAssistantRepository implements BackofficeAssistantRepository {
  private static readonly ENABLE_SETTING_KEY = 'ai_commerce:backoffice_assistant:general:is_enabled';

  getEnableToggleSelector = (): string =>
    `.setting-row[data-setting-key="${SuiteBackofficeAssistantRepository.ENABLE_SETTING_KEY}"] .config-input`;

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
