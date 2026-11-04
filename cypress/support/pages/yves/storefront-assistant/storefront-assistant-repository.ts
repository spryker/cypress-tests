import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class StorefrontAssistantRepository {
  private static readonly SETTING_KEY_PREFIX = 'ai_commerce:storefront_assistant:general';

  private static readonly ENDPOINT_PATH = '/shopping-assistant';

  getConfigurationFeatureKey = (): string => 'ai_commerce';

  getFeatureKey = (): string => 'storefront_assistant';

  getEnabledSettingKey = (): string => `${StorefrontAssistantRepository.SETTING_KEY_PREFIX}:is_enabled`;

  getProductDiscoveryAgentSettingKey = (): string =>
    `${StorefrontAssistantRepository.SETTING_KEY_PREFIX}:is_product_discovery_agent_enabled`;

  getSyncConfigurationCommand = (): string => 'console sync:data configuration';

  getPromptPath = (): string => `${StorefrontAssistantRepository.ENDPOINT_PATH}/prompt`;

  getConversationsPath = (): string => `${StorefrontAssistantRepository.ENDPOINT_PATH}/conversations`;

  getConversationMessagesPath = (): string => `${StorefrontAssistantRepository.ENDPOINT_PATH}/conversations/messages`;

  getPromptPattern = (): string => `**${this.getPromptPath()}`;

  getConversationsPattern = (): RegExp => /\/shopping-assistant\/conversations$/;

  getConversationMessagesPattern = (): RegExp => /\/shopping-assistant\/conversations\/messages\?/;

  getSessionStorageKey = (): string => 'spryker-chat-session';

  getAgentStorageKey = (): string => 'spryker-chat-agent';

  getCsrfTokenHeaderName = (): string => 'X-CSRF-Token';

  getRequestedWithHeaderName = (): string => 'X-Requested-With';

  getRequestedWithHeaderValue = (): string => 'XMLHttpRequest';

  getContentTypeHeaderName = (): string => 'Content-Type';

  getJsonContentType = (): string => 'application/json';

  getInvalidCsrfToken = (): string => 'invalid-token';

  getCsrfTokenAttributeName = (): string => 'csrf-token';

  getPromptUrlAttributeName = (): string => 'prompt-url';

  getMaxMessageLengthAttributeName = (): string => 'max-message-length';

  getTurnStateAttributeName = (): string => 'data-turn-state';

  getOpenAttributeName = (): string => 'data-open';

  getDockedAttributeName = (): string => 'data-chat-docked';

  getExpandedDockAttributeName = (): string => 'data-chat-expanded';

  getExpandedChatClassName = (): string => 'spryker-chat--expanded';

  getActiveAttributeName = (): string => 'data-active';

  getAttachedAttributeName = (): string => 'data-attached';

  getDifferentAttributeName = (): string => 'data-different';

  getDifferencesOnlyAttributeName = (): string => 'data-differences-only';

  getScrollableAttributeName = (): string => 'data-scrollable';

  getEventStreamContentType = (): string => 'text/event-stream';

  getChatTurnFailureMessage = (): string => 'The chat turn failed';

  getCutStreamFailureMessage = (): string => 'The prompt stream ended without a finish event or [DONE]';

  getConversationListFailureMessage = (): string => 'The conversation list could not be loaded';

  getDocumentRootSelector = (): string => 'html';

  getDevelopmentToolbarSelector = (): string => '.sf-toolbar';

  getChatSelector = (): string => 'spryker-chat';

  getReadyChatSelector = (): string => 'spryker-chat[data-state="ready"]';

  getTriggerSelector = (): string => '.storefront-assistant-trigger__button';

  getVisibleTriggerSelector = (): string => '.storefront-assistant-trigger__button:not([hidden])';

  getTriggerTextSelector = (): string => '.storefront-assistant-trigger__button .chat-trigger__text';

  getLauncherSelector = (): string => '.spryker-chat-launcher';

  getPanelSelector = (): string => '.spryker-chat-panel';

  getPanelTitleSelector = (): string => '.spryker-chat-panel__title';

  getCloseSelector = (): string => '.spryker-chat-panel__header-actions > [data-ref="close"]';

  getExpandSelector = (): string => '.spryker-chat-panel__expand';

  getMoreToggleSelector = (): string => '[data-ref="moreToggle"]';

  getMoreMenuSelector = (): string => '.spryker-chat-menu[data-ref="moreMenu"]';

  getMenuItemSelector = (): string => '.spryker-chat-menu__item';

  getNewConversationSelector = (): string => '.spryker-chat-menu [data-ref="newConversation"]';

  getAgentToggleSelector = (): string => '.chat-agent-selector__toggle';

  getAgentLabelSelector = (): string => '.chat-agent-selector__label';

  getAgentOptionsSelector = (): string => '.chat-agent-selector__option';

  getAgentOptionSelector = (value: string): string => `.chat-agent-selector__option[data-value="${value}"]`;

  getWelcomeTextSelector = (): string => '.spryker-chat-transcript__welcome-text';

  getWelcomeZoneSelector = (): string => '.spryker-chat-transcript__welcome-zone';

  getSuggestedPromptSelector = (): string => 'button.chat-suggested-prompts__prompt';

  getTranscriptSelector = (): string => '.spryker-chat-transcript__messages';

  getUserMessageSelector = (): string => '.spryker-chat-message--user';

  getAssistantMessageSelector = (): string => '.spryker-chat-message--assistant .spryker-chat-markdown';

  getAssistantMessageParentSelector = (): string => '.spryker-chat-message--assistant';

  getErrorMessageSelector = (): string => '.spryker-chat-message--error';

  getMarkdownStrongSelector = (): string => 'strong';

  getMarkdownLinkSelector = (href: string): string => `a[href="${href}"]`;

  getMarkdownAnyLinkSelector = (): string => 'a[href]';

  getMarkdownListItemSelector = (): string => 'ul > li';

  getMarkdownTableSelector = (): string => 'table';

  getUnsafeMarkupSelector = (): string => 'script, img, [onerror]';

  getRetrySelector = (): string => 'button.spryker-chat-transcript__retry';

  getLoadingRowSelector = (): string => '.spryker-chat-message--loading';

  getReasoningSelector = (): string => 'details.chat-reasoning';

  getReasoningSummarySelector = (): string => '.chat-reasoning__summary';

  getReasoningPartSelector = (): string => '.chat-reasoning__part';

  getInputSelector = (): string => 'textarea.spryker-chat-composer__input';

  getSendSelector = (): string => '.spryker-chat-composer__send';

  getStopSelector = (): string => '.spryker-chat-composer__stop';

  getHintSelector = (): string => '.spryker-chat-composer__hint';

  getLimitNoticeSelector = (): string => '.spryker-chat-composer__limit';

  getDisclosureSelector = (): string => '.spryker-chat-composer__ai-disclosure-text';

  getMessageActionsSelector = (): string => '.chat-message-actions';

  getCopySelector = (): string => '.chat-message-actions__button[data-ref="copy"]';

  getRegenerateSelector = (): string => '.chat-message-actions__button[data-ref="regenerate"]';

  getCopyStatusSelector = (): string => '.chat-message-actions__copy-status';

  getMessageTimeSelector = (): string => 'time.chat-message-actions__time';

  getPageContextChipSelector = (): string => '.spryker-chat-composer__start .chat-page-context';

  getPageContextLabelSelector = (): string => '.chat-page-context__label';

  getPageContextRemoveSelector = (): string => '[data-ref="remove"]';

  getPageContextAttachSelector = (): string => '[data-ref="attach"]';

  getAttachButtonSelector = (): string => '.chat-attachments__attach-button';

  getFileInputSelector = (): string => 'spryker-chat .chat-attachments__attach input[type="file"]';

  getAttachmentChipSelector = (): string => '.spryker-chat-composer__start .chat-attachments__chip';

  getAttachmentChipNameSelector = (): string => '.chat-attachments__name';

  getAttachmentChipRemoveSelector = (): string => '.chat-attachments__remove';

  getAttachmentPillSelector = (): string => '.spryker-chat-message--user .chat-attachments__pill';

  getAttachmentNoticeReasonSelector = (): string =>
    '.chat-attachments__notice [data-ref]:not([hidden]):not([data-ref="fileName"])';

  getAttachmentNoticeFileNameSelector = (): string => '.chat-attachments__notice [data-ref="fileName"]';

  getProductCardSelector = (): string => 'article.chat-tool-products__card';

  getProductCardNameSelector = (): string => '.chat-tool-products__card-name';

  getProductCardSkuSelector = (): string => '.chat-tool-products__card-sku';

  getProductCardPriceCurrentSelector = (): string => '.chat-tool-products__card-price-current';

  getProductCardPriceOriginalSelector = (): string => '.chat-tool-products__card-price-original';

  getProductCardReasonSelector = (): string => '.chat-tool-products__card-text[data-ref="reason"]';

  getProductCardViewSelector = (): string => 'a.chat-tool-products__card-view';

  getProductCardCompareSelector = (): string => 'button.chat-tool-products__card-compare';

  getProductPromptSelector = (): string => 'button.chat-tool-products__prompt';

  getSeeAllSelector = (): string => 'a.chat-tool-products__see-all-link';

  getRefinementChipSelector = (): string => 'button.chat-tool-products__refinement-chip';

  getFilterPillSelector = (): string => 'button.chat-tool-products__filter-pill';

  getCarouselSelector = (): string => '.chat-tool-products__carousel';

  getCarouselNextSelector = (): string => '.chat-tool-products__carousel-nav--next';

  getCarouselPreviousSelector = (): string => '.chat-tool-products__carousel-nav--previous';

  getCompareTraySelector = (): string => '.chat-tool-compare__tray';

  getCompareTrayCountSelector = (): string => '.chat-tool-compare__tray-count';

  getCompareTraySubmitSelector = (): string => '.chat-tool-compare__tray-submit';

  getCompareTrayChipSelector = (): string => '.chat-tool-compare__chip';

  getComparisonCardSelector = (): string => '.chat-tool-compare__card';

  getComparisonCardTitleSelector = (): string => '.chat-tool-compare__card-title';

  getComparisonCardCountSelector = (): string => '.chat-tool-compare__card-count';

  getComparisonCardProductSelector = (): string => '.chat-tool-compare__card-product';

  getComparisonOpenSelector = (): string => 'button.chat-tool-compare__open';

  getComparisonLinkSelector = (): string => 'a.chat-tool-compare__link';

  getComparisonViewSelector = (): string => 'section.chat-tool-compare__view';

  getComparisonBackSelector = (): string => 'section.chat-tool-compare__view [data-ref="back"]';

  getDifferencesSwitchSelector = (): string => 'input.chat-tool-compare__switch-input';

  getComparisonHeadCellSelector = (): string => 'th.chat-tool-compare__head-cell';

  getComparisonRowSelector = (): string => 'tr.chat-tool-compare__row';

  getChoiceQuestionSelector = (): string => 'p.chat-offer-choices__question';

  getChoiceChipSelector = (): string => 'button.chat-offer-choices__chip';

  getSetupTotalSelector = (): string => 'p.chat-display-setup__total';

  getHistoriesSelector = (): string => '.chat-histories';

  getHistoriesCountSelector = (): string => '.chat-histories__count';

  getHistoryItemSelector = (): string => 'li.chat-histories__item';

  getHistoryItemNameSelector = (): string => '.chat-histories__item-name';

  getHistoryItemOpenSelector = (): string => '.chat-histories__item-open';

  getHistoryItemDeleteSelector = (): string => '.chat-histories__item-delete';

  getHistoryItemCurrentSelector = (): string => '.chat-histories__item-current';

  getHistoryItemTimeSelector = (): string => '.chat-histories__item-time';

  getHistoriesSelectSelector = (): string => '.chat-histories__actions [data-ref="select"]';

  getHistoriesSelectAllSelector = (): string => '.chat-histories__footer [data-ref="selectAll"]';

  getHistoriesDeleteSelectedSelector = (): string => '.chat-histories__delete-selected';

  getHistoriesEmptySelector = (): string => '.chat-histories__empty';

  getHistoriesStartNewSelector = (): string => '.chat-histories__new';

  getHistoriesCloseSelector = (): string => '.chat-histories [data-ref="close"]';

  getPanelFooterSelector = (): string => '.spryker-chat-panel__footer';

  getPanelScrollerSelector = (): string => '.spryker-chat-transcript';

  getProductPageNameSelector = (): string => '[itemtype="https://schema.org/Product"] meta[itemprop="name"]';

  getProductPagePriceSelector = (): string => '[itemtype="https://schema.org/Product"] [itemprop="price"]';

  getTitleText = (): string => 'Shopping Assistant';

  getTriggerAriaLabel = (): string => 'Chat with shopping assistant';

  getGreetingText = (firstName: string): string => `Hello, ${firstName}! How can I help you today?`;

  getPlaceholderText = (): string => 'Ask me anything about our products...';

  getHintText = (): string => 'Enter to send · Shift + Enter for a new line';

  getDisclosureText = (): string => 'AI-generated responses. Review before acting.';

  getCollapseLabel = (): string => 'Collapse assistant';

  getExpandLabel = (): string => 'Expand assistant';

  getHistoryMenuLabel = (): string => 'Chat history';

  getNewConversationLabel = (): string => 'New conversation';

  getReasoningSummaryText = (): string => 'Reasoning';

  getGenericErrorText = (): string => 'Something went wrong. Please try again.';

  getNoAgentErrorText = (): string => 'The shopping assistant is not available right now. Please try again later.';

  getToolDeniedText = (): string => 'Product information could not be retrieved. The answer may be incomplete.';

  getUntitledConversationText = (): string => 'Untitled conversation';

  getCurrentBadgeText = (): string => 'Current';

  getHistoriesEmptyText = (): string => 'No conversations yet. Start a new one!';

  getHistoriesLoadErrorText = (): string => 'Conversations could not be loaded. Please try again.';

  getTooLongNoticeText = (maxLength: number): string =>
    `Your message is too long. Maximum length is ${maxLength} characters.`;

  getCopiedText = (): string => 'Copied';

  getViewProductText = (): string => 'View product';

  getSeeAllText = (count: number): string => `See all ${count} results`;

  getRefinementMessage = (label: string, filterArgument: string, value: string): string =>
    `Show only ${label} [${filterArgument}=${value}]`;

  getRefinementDisplayText = (label: string): string => `Show only ${label}`;

  getRemoveFilterMessage = (label: string, filterArgument: string): string =>
    `Remove the ${label} filter [${filterArgument}]`;

  getRemoveFilterAriaLabel = (label: string): string => `Remove the ${label} filter`;

  getRefinementMessagePattern = (): RegExp => /^Show only .+ \[[A-Za-z][\w.]*=.+\]$/;

  getRefinementHintPattern = (): RegExp => /\[[^\]]*\]$/;

  getCompareMessagePrefix = (): string => 'Compare these products:';

  getCompareMessage = (products: Array<{ name: string; sku: string }>): string =>
    `${this.getCompareMessagePrefix()} ${products.map((product) => `${product.name} (${product.sku})`).join(', ')}`;

  getCompareTrayCountText = (count: number): string =>
    count === 1 ? '1 product selected' : `${count} products selected`;

  getComparisonTitleText = (): string => 'Product comparison';

  getComparisonCountText = (count: number): string => `${count} products`;

  getSetupTotalText = (total: string, budget: string): string => `Total ${total} of your ${budget} budget`;

  getSetupTotalPattern = (): RegExp => /^Total .+ of your .+ budget$/;

  getProductPromptText = (template: string, productName: string): string =>
    template.replace('{productName}', productName);

  getPricePattern = (): RegExp => /€\s?\d/;

  getMessageTimePattern = (): RegExp => /^\d{1,2}:\d{2}/;

  getConversationReferencePattern = (): RegExp => /^[A-Za-z0-9_-]{1,64}$/;

  getGlossaryKeyPrefix = (): string => 'ai_commerce.';
}
