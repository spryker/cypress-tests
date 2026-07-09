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

  getWidgetPanelOpenClass = (): string => 'backoffice-assistant__panel--open';

  getWidgetAgentSelectSelector = (): string => '.js-backoffice-assistant__agent-select';

  getWidgetAgentBadgeSelector = (): string => '.js-backoffice-assistant__agent-badge';

  getWidgetInputSelector = (): string => '.js-backoffice-assistant__input';

  getWidgetSendSelector = (): string => '.js-backoffice-assistant__send';

  getWidgetHistoryButtonSelector = (): string => '.js-backoffice-assistant__history-btn';

  getWidgetNewChatSelector = (): string => '.js-backoffice-assistant__new-chat';

  getWidgetAttachSelector = (): string => '.js-backoffice-assistant__attach';

  getWidgetMessagesSelector = (): string => '.js-backoffice-assistant__messages';

  getWidgetRetryButtonSelector = (): string => '.backoffice-assistant__retry-btn';

  getWidgetFileInputSelector = (): string => '.js-backoffice-assistant__file-input';

  getWidgetAttachmentsPreviewSelector = (): string => '.js-backoffice-assistant__attachments-preview';

  getWidgetAttachmentChipSelector = (): string => '.backoffice-assistant__attachment-chip';

  getWidgetAttachmentChipNameSelector = (): string => '.backoffice-assistant__attachment-chip-name';

  getWidgetMessageAttachmentPillSelector = (): string => '.backoffice-assistant__message-attachment-pill';

  getWidgetContextSuggestionsSelector = (): string => '.js-backoffice-assistant__page-context-suggestions';

  getWidgetFormContextSuggestionLabelSelector = (): string => '.js-backoffice-assistant__form-context-suggestion-label';

  getWidgetContextChipSelector = (): string => '.backoffice-assistant__context-chip';

  getWidgetContextChipNameSelector = (): string => '.js-backoffice-assistant__context-chip-name';

  getWidgetAiMessageSelector = (): string => '.backoffice-assistant__message--ai';

  getWidgetReasoningMessageSelector = (): string => '.backoffice-assistant__message--reasoning';

  getWidgetUserMessageSelector = (): string => '.backoffice-assistant__message--user';

  getWidgetToolCallMessageSelector = (): string => '.backoffice-assistant__message--tool-call';

  getWidgetToolCallNameSelector = (): string => '.backoffice-assistant__tool-call-name';

  getWidgetToolCallArgsSelector = (): string => '[data-section="args"] .backoffice-assistant__tool-call-code';

  getWidgetToolCallResultToggleSelector = (): string => '.backoffice-assistant__tool-call-toggle';

  getWidgetAttachmentChipRemoveSelector = (): string => '.backoffice-assistant__attachment-chip-remove';

  getWidgetMessageAttachmentPillNameSelector = (): string => '.backoffice-assistant__message-attachment-pill-name';

  getWidgetHistoriesSelector = (): string => '.js-backoffice-assistant__histories';

  getWidgetHistoriesListSelector = (): string => '.js-backoffice-assistant__histories-list';

  getWidgetHistoryItemSelector = (): string => '.backoffice-assistant__histories-item';

  getWidgetHistoryItemDeleteSelector = (): string => '.backoffice-assistant__histories-item-delete';

  getWidgetHistoriesEmptySelector = (): string => '.js-backoffice-assistant__histories-empty';

  getFormFillTargetFieldSelector = (fieldName: string): string => `[name="${fieldName}"]`;

  getIboxCollapseLinkSelector = (): string => '.ibox-title .collapse-link';

  getPromptEndpoint = (): string => '**/ai-commerce/backoffice-assistant-prompt/index';

  getHistoriesEndpoint = (): string => '**/ai-commerce/backoffice-assistant-conversation/index';

  getDetailEndpoint = (): string => '**/ai-commerce/backoffice-assistant-conversation/detail**';

  getDeleteEndpoint = (): string => '**/ai-commerce/backoffice-assistant-conversation/delete';

  getPromptPath = (): string => '/ai-commerce/backoffice-assistant-prompt/index';

  getHistoriesPath = (): string => '/ai-commerce/backoffice-assistant-conversation/index';

  getDetailPath = (): string => '/ai-commerce/backoffice-assistant-conversation/detail';

  getDeletePath = (): string => '/ai-commerce/backoffice-assistant-conversation/delete';
}
