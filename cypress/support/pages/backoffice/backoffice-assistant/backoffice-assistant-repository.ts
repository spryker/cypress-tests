import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class BackofficeAssistantRepository {
  private static readonly ENABLE_SETTING_KEY = 'ai_commerce:backoffice_assistant:general:is_enabled';

  private static readonly CHAT_ENDPOINT_PATH = '/ai-commerce/backoffice-assistant-chat';

  getSessionStorageKey = (): string => 'spryker-chat-session';

  getAgentStorageKey = (): string => 'spryker-chat-agent';

  getTriggerLabel = (): string => 'Backoffice Assistant';

  getGreetingText = (): string => 'How can I help you today?';

  getInputPlaceholder = (): string => 'Ask me anything...';

  getAutoAgentLabel = (): string => 'Auto';

  getOrderManagementAgentLabel = (): string => 'Order Management';

  getGenericErrorText = (): string => 'Something went wrong. Please try again.';

  getChatTurnFailureMessage = (): string => 'The chat turn failed';

  getUnsupportedFileTypeText = (): string => 'Unsupported file type';

  getHistoriesEmptyText = (): string => 'No conversations yet';

  getHistoryMenuItemLabel = (): string => 'Chat history';

  getValidationGlossaryKey = (): string => 'backoffice_assistant.validation';

  getInvalidCsrfToken = (): string => 'invalid-token';

  getCsrfTokenHeaderName = (): string => 'X-CSRF-Token';

  getCsrfTokenAttributeName = (): string => 'csrf-token';

  getStreamDoneSentinel = (): string => '[DONE]';

  getEnableToggleSelector = (): string =>
    `.setting-row[data-setting-key="${BackofficeAssistantRepository.ENABLE_SETTING_KEY}"] .config-input`;

  getSaveButtonSelector = (): string => '[data-qa="save-configuration"]';

  getChatSelector = (): string => 'spryker-chat';

  getTriggerSelector = (): string => '[data-chat-trigger]';

  getPanelSelector = (): string => '.spryker-chat-panel';

  getPanelOpenAttribute = (): string => 'data-open';

  getWelcomeTextSelector = (): string => '.spryker-chat-transcript__welcome-text';

  getMoreToggleSelector = (): string => '[data-ref="moreToggle"]';

  getMenuItemSelector = (): string => '.spryker-chat-menu__item';

  getNewConversationSelector = (): string => '[data-ref="newConversation"]';

  getCloseSelector = (): string => '.spryker-chat-panel__header-actions [data-ref="close"]';

  getAgentSelectorToggleSelector = (): string => '.chat-agent-selector__toggle';

  getAgentSelectorLabelSelector = (): string => '.chat-agent-selector__label';

  getAgentSelectorOptionSelector = (): string => '.chat-agent-selector__option';

  getAgentSelectorOptionLabelSelector = (): string => '.chat-agent-selector__option-label';

  getInputSelector = (): string => '.spryker-chat-composer__input';

  getSendSelector = (): string => '.spryker-chat-composer__send';

  getAttachButtonSelector = (): string => '.chat-attachments__attach-button';

  getFileInputSelector = (): string => 'spryker-chat input[type="file"]';

  getAttachmentChipSelector = (): string => '.chat-attachments__chip';

  getAttachmentChipNameSelector = (): string => '.chat-attachments__name';

  getAttachmentChipRemoveSelector = (): string => '.chat-attachments__remove';

  getMessageAttachmentPillSelector = (): string => '.chat-attachments__pill';

  getAttachmentNoticeSelector = (): string => '.chat-attachments__notice';

  getFormContextSuggestionSelector = (): string => '.chat-form-context__suggestion';

  getFormContextChipSelector = (): string => '.chat-form-context__chip';

  getFormContextNameSelector = (): string => '.chat-form-context__name';

  getTranscriptSelector = (): string => '.spryker-chat-transcript__messages';

  getAssistantMessageSelector = (): string => '.spryker-chat-message--assistant';

  getUserMessageSelector = (): string => '.spryker-chat-message--user';

  getErrorMessageSelector = (): string => '.spryker-chat-message--error';

  getRetryButtonSelector = (): string => '.spryker-chat-transcript__retry';

  getReasoningSelector = (): string => '.chat-reasoning';

  getToolCallSelector = (): string => '.chat-tool-calls__card';

  getToolCallNameSelector = (): string => '.chat-tool-calls__name';

  getToolCallToggleSelector = (): string => '.chat-tool-calls__toggle';

  getHistoriesSelector = (): string => '.chat-histories';

  getHistoryItemSelector = (): string => '.chat-histories__item';

  getHistoryItemDeleteSelector = (): string => '.chat-histories__item-delete';

  getHistoryItemOpenSelector = (): string => '.chat-histories__item-open';

  getHistoriesEmptySelector = (): string => '.chat-histories__empty';

  getFormFillTargetFieldSelector = (fieldName: string): string => `[name="${fieldName}"]`;

  getIboxCollapseLinkSelector = (): string => '.ibox-title .collapse-link';

  getPromptPath = (): string => `${BackofficeAssistantRepository.CHAT_ENDPOINT_PATH}/prompt`;

  getConversationsPath = (): string => `${BackofficeAssistantRepository.CHAT_ENDPOINT_PATH}/conversations`;

  getConversationMessagesPath = (): string =>
    `${BackofficeAssistantRepository.CHAT_ENDPOINT_PATH}/conversation-messages`;

  getDeleteConversationPath = (): string => `${BackofficeAssistantRepository.CHAT_ENDPOINT_PATH}/delete-conversation`;

  getEndpointPattern = (path: string): string => `**${path}**`;
}
