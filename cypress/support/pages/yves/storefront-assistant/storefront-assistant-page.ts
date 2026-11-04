import { autoWired, buildChatStreamBody } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { StorefrontAssistantRepository } from './storefront-assistant-repository';

type StreamEvent = Record<string, unknown>;

interface StreamReplyOptions {
  delayMs?: number;
  isTerminated?: boolean;
}

interface ToolEventsOptions {
  text?: string;
  conversationReference?: string;
  agent?: string;
}

interface StoredConversation {
  conversationReference: string;
  name: string;
  updatedAtSecondsAgo: number;
}

interface StoredMessage {
  role: string;
  content: string;
  toolName?: string;
  toolResult?: unknown;
}

interface EndpointRequest {
  method: string;
  path: string;
  query?: string;
  body?: unknown;
  rawBody?: string;
  contentType?: string;
  csrfToken?: string;
}

interface LatestTurnSummary {
  cardCount: number;
  comparisonCount: number;
  choiceCount: number;
  setupTotalCount: number;
  text: string;
}

interface SelectedFile {
  contents: ReturnType<typeof Cypress.Buffer.alloc>;
  fileName: string;
  mimeType: string;
}

@injectable()
@autoWired
export class StorefrontAssistantPage extends YvesPage {
  @inject(StorefrontAssistantRepository) private repository: StorefrontAssistantRepository;

  protected PAGE_URL = '/DE/en';

  visitWithChat = (path: string, options: { keepChatStorage?: boolean } = {}): Cypress.Chainable => {
    this.visitWithoutChat(path, options);

    return cy.get(this.repository.getReadyChatSelector());
  };

  visitWithoutChat = (path: string, options: { keepChatStorage?: boolean } = {}): Cypress.Chainable =>
    cy.visit(path, {
      onBeforeLoad: (win: Cypress.AUTWindow): void => {
        if (!options.keepChatStorage) {
          this.clearChatStorage(win);
        }
      },
      onLoad: (win: Cypress.AUTWindow): void => this.hideDevelopmentToolbar(win),
    });

  openPanel = (): Cypress.Chainable => {
    cy.get(this.repository.getReadyChatSelector());
    cy.get(this.repository.getVisibleTriggerSelector()).click();

    return this.getChat().should('have.attr', this.repository.getOpenAttributeName());
  };

  clickTrigger = (): Cypress.Chainable => this.getTrigger().click();

  closePanel = (): Cypress.Chainable => cy.get(this.repository.getCloseSelector()).click();

  pressEscape = (): Cypress.Chainable => this.getInput().type('{esc}');

  toggleExpand = (): Cypress.Chainable => this.getExpandButton().click();

  openMoreMenu = (): Cypress.Chainable => this.getMoreToggle().click();

  selectAgent = (value: string): Cypress.Chainable => {
    this.openAgentMenu();

    return this.clickAgentOption(value);
  };

  openAgentMenu = (): Cypress.Chainable => this.getAgentToggle().click();

  clickAgentOption = (value: string): Cypress.Chainable => this.getAgentOption(value).click();

  pressEscapeOnFocusedElement = (): Cypress.Chainable => cy.focused().type('{esc}');

  typeMessage = (text: string): Cypress.Chainable => this.getInput().type(text, { delay: 0 });

  sendMessage = (text: string): Cypress.Chainable => this.getInput().clear().type(`${text}{enter}`, { delay: 0 });

  pressEnter = (): Cypress.Chainable => this.getInput().type('{enter}');

  pressShiftEnter = (): Cypress.Chainable => this.getInput().type('{shift+enter}');

  clearInput = (): Cypress.Chainable => this.getInput().clear();

  setInputValue = (text: string): Cypress.Chainable => this.getInput().invoke('val', text).trigger('input');

  clickSend = (): Cypress.Chainable => this.getSendButton().click();

  clickStop = (): Cypress.Chainable => this.getStopButton().click();

  clickRetry = (): Cypress.Chainable => this.getRetryButton().click();

  clickCopy = (): Cypress.Chainable => this.getMessageActions().last().find(this.repository.getCopySelector()).click();

  clickRegenerate = (): Cypress.Chainable =>
    this.getMessageActions().last().find(this.repository.getRegenerateSelector()).click();

  clickSuggestedPrompt = (text: string): Cypress.Chainable =>
    cy.contains(this.repository.getSuggestedPromptSelector(), text).click();

  clickFirstSuggestedPrompt = (): Cypress.Chainable => this.getSuggestedPrompts().first().click();

  clickProductPrompt = (text: string): Cypress.Chainable =>
    cy.contains(this.repository.getProductPromptSelector(), text).click();

  clickRefinementChip = (index: number): Cypress.Chainable => this.getRefinementChips().eq(index).click();

  clickFilterPill = (index: number): Cypress.Chainable => this.getFilterPills().eq(index).click();

  selectProductForComparison = (index: number): Cypress.Chainable =>
    this.getProductCards().eq(index).find(this.repository.getProductCardCompareSelector()).click();

  submitComparison = (): Cypress.Chainable => this.getCompareTraySubmit().click();

  openComparisonView = (): Cypress.Chainable =>
    this.getComparisonCards().last().find(this.repository.getComparisonOpenSelector()).click();

  toggleDifferencesOnly = (): Cypress.Chainable => this.getDifferencesSwitch().click({ force: true });

  closeComparisonView = (): Cypress.Chainable => cy.get(this.repository.getComparisonBackSelector()).click();

  clickChoice = (text: string): Cypress.Chainable => cy.contains(this.repository.getChoiceChipSelector(), text).click();

  clickCarouselNext = (): Cypress.Chainable => this.getCarouselNext().click();

  removePageContext = (): Cypress.Chainable =>
    this.getPageContextChip().find(this.repository.getPageContextRemoveSelector()).click();

  attachPageContext = (): Cypress.Chainable =>
    this.getPageContextChip().find(this.repository.getPageContextAttachSelector()).click();

  attachFiles = (files: Cypress.FileReference[]): Cypress.Chainable =>
    cy.get(this.repository.getFileInputSelector()).selectFile(files, { force: true });

  removeAttachmentChip = (name: string): Cypress.Chainable =>
    cy
      .contains(this.repository.getAttachmentChipSelector(), name)
      .find(this.repository.getAttachmentChipRemoveSelector())
      .click();

  openHistory = (): Cypress.Chainable => {
    this.openMoreMenu();

    return cy.contains(this.repository.getMenuItemSelector(), this.repository.getHistoryMenuLabel()).click();
  };

  startNewConversation = (): Cypress.Chainable => {
    this.openMoreMenu();

    return cy.get(this.repository.getNewConversationSelector()).click();
  };

  openHistoryItem = (index: number): Cypress.Chainable =>
    this.getHistoryItems().eq(index).find(this.repository.getHistoryItemOpenSelector()).click();

  deleteHistoryItem = (index: number): Cypress.Chainable =>
    this.getHistoryItems().eq(index).find(this.repository.getHistoryItemDeleteSelector()).click();

  deleteHistoryItemByName = (name: string): Cypress.Chainable =>
    cy
      .contains(this.repository.getHistoryItemSelector(), name)
      .find(this.repository.getHistoryItemDeleteSelector())
      .click();

  startHistorySelection = (): Cypress.Chainable => cy.get(this.repository.getHistoriesSelectSelector()).click();

  selectAllHistoryItems = (): Cypress.Chainable => cy.get(this.repository.getHistoriesSelectAllSelector()).click();

  deleteSelectedHistoryItems = (): Cypress.Chainable =>
    cy.get(this.repository.getHistoriesDeleteSelectedSelector()).click();

  startNewChatFromHistory = (): Cypress.Chainable => cy.get(this.repository.getHistoriesStartNewSelector()).click();

  closeHistory = (): Cypress.Chainable => cy.get(this.repository.getHistoriesCloseSelector()).click();

  stubClipboard = (): Cypress.Chainable =>
    cy.window().then((win): void => {
      const writeText = cy.stub().as('clipboardWrite').resolves();

      Object.defineProperty(win.navigator, 'clipboard', { value: { writeText }, configurable: true });
    });

  stubConfirm = (result: boolean): Cypress.Chainable =>
    cy.window().then((win): void => {
      const confirm = win.confirm as unknown as Partial<Cypress.Agent<sinon.SinonStub>>;

      if (typeof confirm.returns === 'function') {
        confirm.returns(result);

        return;
      }

      cy.stub(win, 'confirm').as('confirmDialog').returns(result);
    });

  allowUncaughtError = (messagePart: string): void => {
    cy.on('uncaught:exception', (error: Error): false | void => {
      if (String(error?.message).includes(messagePart)) {
        return false;
      }
    });
  };

  allowChatTurnFailure = (): void => this.allowUncaughtError(this.repository.getChatTurnFailureMessage());

  allowCutStreamFailure = (): void => this.allowUncaughtError(this.repository.getCutStreamFailureMessage());

  allowConversationListFailure = (): void =>
    this.allowUncaughtError(this.repository.getConversationListFailureMessage());

  buildStreamReply = (events: StreamEvent[], options: StreamReplyOptions = {}): Record<string, unknown> => ({
    statusCode: 200,
    headers: { 'content-type': this.repository.getEventStreamContentType() },
    body: buildChatStreamBody(events, { isTerminated: options.isTerminated }),
    ...(options.delayMs ? { delay: options.delayMs } : {}),
  });

  buildToolEvents = (toolName: string, result: unknown, options: ToolEventsOptions = {}): StreamEvent[] => {
    const toolCallId = `call_${toolName}`;
    const textId = `text_${toolName}`;

    return [
      {
        type: 'start',
        messageId: `msg_${toolName}`,
        ...(options.conversationReference
          ? { messageMetadata: { conversationReference: options.conversationReference } }
          : {}),
      },
      ...(options.agent ? [{ type: 'data-agent', data: { name: options.agent } }] : []),
      { type: 'tool-input-start', toolCallId, toolName },
      { type: 'tool-input-available', toolCallId, toolName, input: {} },
      { type: 'tool-output-available', toolCallId, output: { result: JSON.stringify(result) } },
      ...(options.text
        ? [
            { type: 'text-start', id: textId },
            { type: 'text-delta', id: textId, delta: options.text },
            { type: 'text-end', id: textId },
          ]
        : []),
      { type: 'finish' },
    ];
  };

  interceptPromptWithReplies = (replies: Array<Record<string, unknown>>): Cypress.Chainable => {
    let replyIndex = 0;

    return cy
      .intercept('POST', this.repository.getPromptPattern(), (request): void => {
        const reply = replies[Math.min(replyIndex, replies.length - 1)];
        replyIndex += 1;
        request.reply(reply);
      })
      .as('sfaPrompt');
  };

  interceptPromptWithStream = (events: StreamEvent[], options: StreamReplyOptions = {}): Cypress.Chainable =>
    this.interceptPromptWithReplies([this.buildStreamReply(events, options)]);

  interceptRealPrompt = (): Cypress.Chainable =>
    cy.intercept('POST', this.repository.getPromptPattern()).as('sfaRealPrompt');

  interceptConversationStore = (conversations: StoredConversation[]): Cypress.Chainable => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    let storedConversations = conversations.map((conversation) => ({
      conversationReference: conversation.conversationReference,
      name: conversation.name,
      updatedAt: nowInSeconds - conversation.updatedAtSecondsAgo,
    }));

    cy.intercept({ method: 'GET', url: this.repository.getConversationsPattern() }, (request): void => {
      request.reply({ statusCode: 200, body: { conversations: storedConversations } });
    }).as('sfaConversations');

    return cy
      .intercept({ method: 'DELETE', url: this.repository.getConversationsPattern() }, (request): void => {
        const references: string[] = (this.readBody(request.body).conversationReferences as string[]) ?? [];
        const remainingConversations = storedConversations.filter(
          (conversation) => !references.includes(conversation.conversationReference)
        );
        const deletedCount = storedConversations.length - remainingConversations.length;

        storedConversations = remainingConversations;
        request.reply({ statusCode: 200, body: { deletedCount } });
      })
      .as('sfaDelete');
  };

  interceptConversationListFailure = (): Cypress.Chainable =>
    cy
      .intercept({ method: 'GET', url: this.repository.getConversationsPattern() }, { statusCode: 500, body: {} })
      .as('sfaConversations');

  interceptConversations = (): Cypress.Chainable =>
    cy.intercept({ method: 'GET', url: this.repository.getConversationsPattern() }).as('sfaConversations');

  interceptDeleteConversations = (): Cypress.Chainable =>
    cy.intercept({ method: 'DELETE', url: this.repository.getConversationsPattern() }).as('sfaDelete');

  interceptConversationMessages = (): Cypress.Chainable =>
    cy.intercept('GET', this.repository.getConversationMessagesPattern()).as('sfaMessages');

  interceptConversationMessagesWith = (conversationReference: string, messages: StoredMessage[]): Cypress.Chainable =>
    cy
      .intercept('GET', this.repository.getConversationMessagesPattern(), {
        statusCode: 200,
        body: {
          conversationReference,
          messages: messages.map((message) => ({
            role: message.role,
            content: message.content,
            attachments: [],
            toolInvocations: message.toolName
              ? [{ name: message.toolName, result: JSON.stringify(message.toolResult) }]
              : [],
          })),
        },
      })
      .as('sfaMessages');

  getAlias = (alias: string): Cypress.Chainable => cy.get(`@${alias}`);

  buildGeneratedFile = (fileName: string, mimeType: string, sizeBytes: number): SelectedFile => ({
    contents: Cypress.Buffer.alloc(sizeBytes, 1),
    fileName,
    mimeType,
  });

  readLatestTurnSummary = (): Cypress.Chainable<LatestTurnSummary> =>
    this.getTranscript().then(($transcript): LatestTurnSummary => {
      const $turn = $transcript.find(this.repository.getUserMessageSelector()).last().nextAll();
      const count = (selector: string): number => $turn.filter(selector).add($turn.find(selector)).length;
      const $answers = $turn
        .filter(this.repository.getAssistantMessageParentSelector())
        .add($turn.find(this.repository.getAssistantMessageSelector()));

      return {
        cardCount: count(this.repository.getProductCardSelector()),
        comparisonCount: count(this.repository.getComparisonCardSelector()),
        choiceCount: count(this.repository.getChoiceChipSelector()),
        setupTotalCount: count(this.repository.getSetupTotalSelector()),
        text: $answers.text().trim(),
      };
    });

  readCsrfTokenIfPresent = (): Cypress.Chainable<string> =>
    cy
      .document()
      .then((document) =>
        String(
          document
            .querySelector(this.repository.getChatSelector())
            ?.getAttribute(this.repository.getCsrfTokenAttributeName()) ?? ''
        )
      );

  readBody = (body: unknown): Record<string, unknown> =>
    typeof body === 'string' && body !== '' ? JSON.parse(body) : ((body ?? {}) as Record<string, unknown>);

  readSessionStorage = (): Cypress.Chainable<Record<string, unknown>> =>
    this.readStorage(this.repository.getSessionStorageKey());

  readAgentStorage = (): Cypress.Chainable<Record<string, unknown>> =>
    this.readStorage(this.repository.getAgentStorageKey());

  readCsrfToken = (): Cypress.Chainable<string> =>
    this.getChat().then(($chat) => String($chat.attr(this.repository.getCsrfTokenAttributeName()) ?? ''));

  readPromptUrl = (): Cypress.Chainable<string> =>
    this.getChat().then(($chat) => String($chat.attr(this.repository.getPromptUrlAttributeName()) ?? ''));

  readMaxMessageLength = (): Cypress.Chainable<number> =>
    this.getChat().then(($chat) => Number($chat.attr(this.repository.getMaxMessageLengthAttributeName())));

  readFileAsBase64 = (path: string): Cypress.Chainable<string> => cy.readFile(path, 'base64');

  readDocumentScrollOverflow = (): Cypress.Chainable<number> =>
    cy.window().then((win) => win.document.documentElement.scrollWidth - win.innerWidth);

  readLayoutViewportWidth = (): Cypress.Chainable<number> =>
    cy.window().then((win) => win.document.documentElement.clientWidth);

  readIsPointInsidePanel = (selector: string): Cypress.Chainable<boolean> =>
    cy.get(selector).then(($element) => {
      const rectangle = $element[0].getBoundingClientRect();
      const element = $element[0].ownerDocument.elementFromPoint(
        rectangle.left + rectangle.width / 2,
        rectangle.top + rectangle.height / 2
      );

      return element !== null && element.closest(this.repository.getPanelSelector()) !== null;
    });

  readHasWindowProperty = (key: string): Cypress.Chainable<boolean> => cy.window().then((win) => key in win);

  requestEndpoint = (request: EndpointRequest): Cypress.Chainable<Cypress.Response<Record<string, unknown>>> => {
    const headers: Record<string, string> = {
      [this.repository.getRequestedWithHeaderName()]: this.repository.getRequestedWithHeaderValue(),
    };

    if (request.csrfToken !== undefined) {
      headers[this.repository.getCsrfTokenHeaderName()] = request.csrfToken;
    }

    if (request.rawBody !== undefined || request.body !== undefined) {
      headers[this.repository.getContentTypeHeaderName()] = request.contentType ?? this.repository.getJsonContentType();
    }

    return cy.request({
      method: request.method,
      url: `${request.path}${request.query ? `?${request.query}` : ''}`,
      headers,
      body: request.rawBody ?? (request.body === undefined ? undefined : JSON.stringify(request.body)),
      failOnStatusCode: false,
    });
  };

  syncConfiguration = (): void => {
    cy.runQueueWorker();
    cy.runCliCommands([this.repository.getSyncConfigurationCommand()]);
  };

  getConfigurationFeatureKey = (): string => this.repository.getConfigurationFeatureKey();

  getFeatureKey = (): string => this.repository.getFeatureKey();

  getJsonContentType = (): string => this.repository.getJsonContentType();

  getEnabledSettingKey = (): string => this.repository.getEnabledSettingKey();

  getProductDiscoveryAgentSettingKey = (): string => this.repository.getProductDiscoveryAgentSettingKey();

  getPromptPath = (localePath: string): string => `${localePath}${this.repository.getPromptPath()}`;

  getEndpointPath = (localePath: string, endpoint: 'prompt' | 'conversations' | 'messages'): string => {
    const paths = {
      prompt: this.repository.getPromptPath(),
      conversations: this.repository.getConversationsPath(),
      messages: this.repository.getConversationMessagesPath(),
    };

    return `${localePath}${paths[endpoint]}`;
  };

  getCsrfTokenHeaderName = (): string => this.repository.getCsrfTokenHeaderName();

  getRequestedWithHeaderName = (): string => this.repository.getRequestedWithHeaderName();

  getRequestedWithHeaderValue = (): string => this.repository.getRequestedWithHeaderValue();

  getInvalidCsrfToken = (): string => this.repository.getInvalidCsrfToken();

  getTurnStateAttributeName = (): string => this.repository.getTurnStateAttributeName();

  getOpenAttributeName = (): string => this.repository.getOpenAttributeName();

  getDockedAttributeName = (): string => this.repository.getDockedAttributeName();

  getExpandedDockAttributeName = (): string => this.repository.getExpandedDockAttributeName();

  getExpandedChatClassName = (): string => this.repository.getExpandedChatClassName();

  getActiveAttributeName = (): string => this.repository.getActiveAttributeName();

  getAttachedAttributeName = (): string => this.repository.getAttachedAttributeName();

  getDifferentAttributeName = (): string => this.repository.getDifferentAttributeName();

  getDifferencesOnlyAttributeName = (): string => this.repository.getDifferencesOnlyAttributeName();

  getScrollableAttributeName = (): string => this.repository.getScrollableAttributeName();

  getEventStreamContentType = (): string => this.repository.getEventStreamContentType();

  getPanelTitleSelector = (): string => this.repository.getPanelTitleSelector();

  getAgentToggleSelector = (): string => this.repository.getAgentToggleSelector();

  getTitleText = (): string => this.repository.getTitleText();

  getTriggerAriaLabel = (): string => this.repository.getTriggerAriaLabel();

  getGreetingText = (firstName: string): string => this.repository.getGreetingText(firstName);

  getPlaceholderText = (): string => this.repository.getPlaceholderText();

  getHintText = (): string => this.repository.getHintText();

  getDisclosureText = (): string => this.repository.getDisclosureText();

  getCollapseLabel = (): string => this.repository.getCollapseLabel();

  getExpandLabel = (): string => this.repository.getExpandLabel();

  getHistoryMenuLabel = (): string => this.repository.getHistoryMenuLabel();

  getNewConversationLabel = (): string => this.repository.getNewConversationLabel();

  getReasoningSummaryText = (): string => this.repository.getReasoningSummaryText();

  getGenericErrorText = (): string => this.repository.getGenericErrorText();

  getNoAgentErrorText = (): string => this.repository.getNoAgentErrorText();

  getToolDeniedText = (): string => this.repository.getToolDeniedText();

  getUntitledConversationText = (): string => this.repository.getUntitledConversationText();

  getCurrentBadgeText = (): string => this.repository.getCurrentBadgeText();

  getHistoriesEmptyText = (): string => this.repository.getHistoriesEmptyText();

  getHistoriesLoadErrorText = (): string => this.repository.getHistoriesLoadErrorText();

  getTooLongNoticeText = (maxLength: number): string => this.repository.getTooLongNoticeText(maxLength);

  getCopiedText = (): string => this.repository.getCopiedText();

  getViewProductText = (): string => this.repository.getViewProductText();

  getSeeAllText = (count: number): string => this.repository.getSeeAllText(count);

  getRefinementMessage = (label: string, filterArgument: string, value: string): string =>
    this.repository.getRefinementMessage(label, filterArgument, value);

  getRefinementDisplayText = (label: string): string => this.repository.getRefinementDisplayText(label);

  getRemoveFilterMessage = (label: string, filterArgument: string): string =>
    this.repository.getRemoveFilterMessage(label, filterArgument);

  getRemoveFilterAriaLabel = (label: string): string => this.repository.getRemoveFilterAriaLabel(label);

  getRefinementMessagePattern = (): RegExp => this.repository.getRefinementMessagePattern();

  getRefinementHintPattern = (): RegExp => this.repository.getRefinementHintPattern();

  getCompareMessagePrefix = (): string => this.repository.getCompareMessagePrefix();

  getCompareMessage = (products: Array<{ name: string; sku: string }>): string =>
    this.repository.getCompareMessage(products);

  getCompareTrayCountText = (count: number): string => this.repository.getCompareTrayCountText(count);

  getComparisonTitleText = (): string => this.repository.getComparisonTitleText();

  getComparisonCountText = (count: number): string => this.repository.getComparisonCountText(count);

  getSetupTotalText = (total: string, budget: string): string => this.repository.getSetupTotalText(total, budget);

  getSetupTotalPattern = (): RegExp => this.repository.getSetupTotalPattern();

  getProductPromptText = (template: string, productName: string): string =>
    this.repository.getProductPromptText(template, productName);

  getPricePattern = (): RegExp => this.repository.getPricePattern();

  getMessageTimePattern = (): RegExp => this.repository.getMessageTimePattern();

  getConversationReferencePattern = (): RegExp => this.repository.getConversationReferencePattern();

  getGlossaryKeyPrefix = (): string => this.repository.getGlossaryKeyPrefix();

  getHtml = (): Cypress.Chainable => cy.get(this.repository.getDocumentRootSelector());

  getChat = (options?: Partial<Cypress.Timeoutable>): Cypress.Chainable =>
    cy.get(this.repository.getChatSelector(), options);

  getTrigger = (): Cypress.Chainable => cy.get(this.repository.getTriggerSelector());

  getTriggerText = (): Cypress.Chainable => cy.get(this.repository.getTriggerTextSelector());

  getLauncher = (): Cypress.Chainable => cy.get(this.repository.getLauncherSelector());

  getPanel = (): Cypress.Chainable => cy.get(this.repository.getPanelSelector());

  getPanelTitle = (): Cypress.Chainable => cy.get(this.repository.getPanelTitleSelector());

  getPanelScroller = (): Cypress.Chainable => cy.get(this.repository.getPanelScrollerSelector());

  getPanelFooter = (): Cypress.Chainable => cy.get(this.repository.getPanelFooterSelector());

  getCloseButton = (): Cypress.Chainable => cy.get(this.repository.getCloseSelector());

  getExpandButton = (): Cypress.Chainable => cy.get(this.repository.getExpandSelector());

  getMoreToggle = (): Cypress.Chainable => cy.get(this.repository.getMoreToggleSelector());

  getMoreMenu = (): Cypress.Chainable => cy.get(this.repository.getMoreMenuSelector());

  getMenuItems = (): Cypress.Chainable => this.getMoreMenu().find(this.repository.getMenuItemSelector());

  getAgentToggle = (): Cypress.Chainable => cy.get(this.repository.getAgentToggleSelector());

  getAgentLabel = (): Cypress.Chainable => cy.get(this.repository.getAgentLabelSelector());

  getAgentOptions = (): Cypress.Chainable => cy.get(this.repository.getAgentOptionsSelector());

  getAgentOption = (value: string): Cypress.Chainable => cy.get(this.repository.getAgentOptionSelector(value));

  getWelcomeText = (): Cypress.Chainable => cy.get(this.repository.getWelcomeTextSelector());

  getWelcomeZone = (): Cypress.Chainable => cy.get(this.repository.getWelcomeZoneSelector());

  getSuggestedPrompts = (): Cypress.Chainable => cy.get(this.repository.getSuggestedPromptSelector());

  getTranscript = (): Cypress.Chainable => cy.get(this.repository.getTranscriptSelector());

  getUserMessages = (): Cypress.Chainable => this.getTranscript().find(this.repository.getUserMessageSelector());

  getLastAnswer = (): Cypress.Chainable => this.getAssistantMessages().last();

  getLastAnswerStrong = (): Cypress.Chainable => this.getLastAnswer().find(this.repository.getMarkdownStrongSelector());

  getLastAnswerLink = (href: string): Cypress.Chainable =>
    this.getLastAnswer().find(this.repository.getMarkdownLinkSelector(href));

  getLastAnswerLinks = (): Cypress.Chainable => this.getLastAnswer().find(this.repository.getMarkdownAnyLinkSelector());

  getLastAnswerListItems = (): Cypress.Chainable =>
    this.getLastAnswer().find(this.repository.getMarkdownListItemSelector());

  getLastAnswerTables = (): Cypress.Chainable => this.getLastAnswer().find(this.repository.getMarkdownTableSelector());

  getLastAnswerUnsafeMarkup = (): Cypress.Chainable =>
    this.getLastAnswer().find(this.repository.getUnsafeMarkupSelector());

  getAssistantMessages = (options?: Partial<Cypress.Timeoutable>): Cypress.Chainable =>
    this.getTranscript().find(this.repository.getAssistantMessageSelector(), options);

  getErrorMessages = (options?: Partial<Cypress.Timeoutable>): Cypress.Chainable =>
    this.getTranscript().find(this.repository.getErrorMessageSelector(), options);

  getRetryButton = (options?: Partial<Cypress.Timeoutable>): Cypress.Chainable =>
    cy.get(this.repository.getRetrySelector(), options);

  getLoadingRow = (): Cypress.Chainable => cy.get(this.repository.getLoadingRowSelector());

  getReasoning = (): Cypress.Chainable => this.getTranscript().find(this.repository.getReasoningSelector());

  getReasoningSummary = (): Cypress.Chainable =>
    this.getReasoning().find(this.repository.getReasoningSummarySelector());

  getReasoningParts = (): Cypress.Chainable => this.getReasoning().find(this.repository.getReasoningPartSelector());

  getInput = (): Cypress.Chainable => cy.get(this.repository.getInputSelector());

  getSendButton = (): Cypress.Chainable => cy.get(this.repository.getSendSelector());

  getStopButton = (): Cypress.Chainable => cy.get(this.repository.getStopSelector());

  getHint = (): Cypress.Chainable => cy.get(this.repository.getHintSelector());

  getLimitNotice = (): Cypress.Chainable => cy.get(this.repository.getLimitNoticeSelector());

  getDisclosure = (): Cypress.Chainable => cy.get(this.repository.getDisclosureSelector());

  getMessageActions = (): Cypress.Chainable => this.getTranscript().find(this.repository.getMessageActionsSelector());

  getCopyButtons = (): Cypress.Chainable => this.getMessageActions().find(this.repository.getCopySelector());

  getRegenerateButtons = (): Cypress.Chainable =>
    this.getMessageActions().find(this.repository.getRegenerateSelector());

  getCopyStatus = (): Cypress.Chainable => this.getMessageActions().find(this.repository.getCopyStatusSelector());

  getMessageTimes = (): Cypress.Chainable => this.getMessageActions().find(this.repository.getMessageTimeSelector());

  getPageContextChip = (): Cypress.Chainable => cy.get(this.repository.getPageContextChipSelector());

  getPageContextLabel = (): Cypress.Chainable =>
    this.getPageContextChip().find(this.repository.getPageContextLabelSelector());

  getPageContextAttachButton = (): Cypress.Chainable =>
    this.getPageContextChip().find(this.repository.getPageContextAttachSelector());

  getPageContextRemoveButton = (): Cypress.Chainable =>
    this.getPageContextChip().find(this.repository.getPageContextRemoveSelector());

  getAttachButton = (): Cypress.Chainable => cy.get(this.repository.getAttachButtonSelector());

  getAttachmentChips = (): Cypress.Chainable => cy.get(this.repository.getAttachmentChipSelector());

  getAttachmentChipNames = (): Cypress.Chainable =>
    this.getAttachmentChips().find(this.repository.getAttachmentChipNameSelector());

  getAttachmentPills = (): Cypress.Chainable => this.getTranscript().find(this.repository.getAttachmentPillSelector());

  getAttachmentNoticeReason = (): Cypress.Chainable => cy.get(this.repository.getAttachmentNoticeReasonSelector());

  getAttachmentNoticeFileName = (): Cypress.Chainable => cy.get(this.repository.getAttachmentNoticeFileNameSelector());

  getProductCards = (options?: Partial<Cypress.Timeoutable>): Cypress.Chainable =>
    this.getTranscript().find(this.repository.getProductCardSelector(), options);

  getProductCardName = (index: number): Cypress.Chainable =>
    this.getProductCards().eq(index).find(this.repository.getProductCardNameSelector());

  getProductCardSku = (index: number): Cypress.Chainable =>
    this.getProductCards().eq(index).find(this.repository.getProductCardSkuSelector());

  getProductCardPrice = (index: number): Cypress.Chainable =>
    this.getProductCards().eq(index).find(this.repository.getProductCardPriceCurrentSelector());

  getProductCardOriginalPrice = (index: number): Cypress.Chainable =>
    this.getProductCards().eq(index).find(this.repository.getProductCardPriceOriginalSelector());

  getProductCardReason = (index: number): Cypress.Chainable =>
    this.getProductCards().eq(index).find(this.repository.getProductCardReasonSelector());

  getProductCardView = (index: number): Cypress.Chainable =>
    this.getProductCards().eq(index).find(this.repository.getProductCardViewSelector());

  getProductPrompts = (): Cypress.Chainable => this.getTranscript().find(this.repository.getProductPromptSelector());

  getSeeAllLink = (): Cypress.Chainable => this.getTranscript().find(this.repository.getSeeAllSelector());

  getRefinementChips = (): Cypress.Chainable => this.getTranscript().find(this.repository.getRefinementChipSelector());

  getFilterPills = (): Cypress.Chainable => this.getTranscript().find(this.repository.getFilterPillSelector());

  getCarousel = (): Cypress.Chainable => this.getTranscript().find(this.repository.getCarouselSelector());

  getCarouselNext = (): Cypress.Chainable => this.getCarousel().find(this.repository.getCarouselNextSelector());

  getCarouselPrevious = (): Cypress.Chainable => this.getCarousel().find(this.repository.getCarouselPreviousSelector());

  getCompareTray = (): Cypress.Chainable => cy.get(this.repository.getCompareTraySelector());

  getCompareTrayCount = (): Cypress.Chainable => cy.get(this.repository.getCompareTrayCountSelector());

  getCompareTraySubmit = (): Cypress.Chainable => cy.get(this.repository.getCompareTraySubmitSelector());

  getCompareTrayChips = (): Cypress.Chainable =>
    this.getCompareTray().find(this.repository.getCompareTrayChipSelector());

  getComparisonCards = (options?: Partial<Cypress.Timeoutable>): Cypress.Chainable =>
    this.getTranscript().find(this.repository.getComparisonCardSelector(), options);

  getComparisonCardTitle = (): Cypress.Chainable =>
    this.getComparisonCards().last().find(this.repository.getComparisonCardTitleSelector());

  getComparisonCardCount = (): Cypress.Chainable =>
    this.getComparisonCards().last().find(this.repository.getComparisonCardCountSelector());

  getComparisonCardProducts = (): Cypress.Chainable =>
    this.getComparisonCards().last().find(this.repository.getComparisonCardProductSelector());

  getComparisonLink = (): Cypress.Chainable =>
    this.getComparisonCards().last().find(this.repository.getComparisonLinkSelector());

  getComparisonView = (): Cypress.Chainable => cy.get(this.repository.getComparisonViewSelector());

  getDifferencesSwitch = (): Cypress.Chainable => cy.get(this.repository.getDifferencesSwitchSelector());

  getComparisonHeadCells = (): Cypress.Chainable =>
    this.getComparisonView().find(this.repository.getComparisonHeadCellSelector());

  getComparisonRows = (): Cypress.Chainable =>
    this.getComparisonView().find(this.repository.getComparisonRowSelector());

  getComparisonRow = (label: string): Cypress.Chainable =>
    cy.contains(this.repository.getComparisonRowSelector(), label);

  getChoiceQuestion = (): Cypress.Chainable => this.getTranscript().find(this.repository.getChoiceQuestionSelector());

  getChoiceChips = (): Cypress.Chainable => this.getTranscript().find(this.repository.getChoiceChipSelector());

  getChoiceChip = (text: string): Cypress.Chainable => cy.contains(this.repository.getChoiceChipSelector(), text);

  getSetupTotal = (): Cypress.Chainable => this.getTranscript().find(this.repository.getSetupTotalSelector());

  getHistories = (): Cypress.Chainable => cy.get(this.repository.getHistoriesSelector());

  getHistoriesCount = (): Cypress.Chainable => cy.get(this.repository.getHistoriesCountSelector());

  getHistoryItems = (): Cypress.Chainable => this.getHistories().find(this.repository.getHistoryItemSelector());

  getHistoryItemByName = (name: string): Cypress.Chainable =>
    cy.contains(this.repository.getHistoryItemSelector(), name);

  getHistoryItemNames = (): Cypress.Chainable =>
    this.getHistoryItems().find(this.repository.getHistoryItemNameSelector());

  getHistoryItemTimes = (): Cypress.Chainable =>
    this.getHistoryItems().find(this.repository.getHistoryItemTimeSelector());

  getHistoryItemCurrent = (index: number): Cypress.Chainable =>
    this.getHistoryItems().eq(index).find(this.repository.getHistoryItemCurrentSelector());

  getHistoriesSelect = (): Cypress.Chainable => cy.get(this.repository.getHistoriesSelectSelector());

  getHistoriesEmpty = (): Cypress.Chainable => cy.get(this.repository.getHistoriesEmptySelector());

  getProductPageName = (): Cypress.Chainable => cy.get(this.repository.getProductPageNameSelector());

  getProductPagePrice = (): Cypress.Chainable => cy.get(this.repository.getProductPagePriceSelector());

  private readStorage = (key: string): Cypress.Chainable<Record<string, unknown>> =>
    cy
      .window()
      .its('localStorage')
      .invoke('getItem', key)
      .then((stored) => JSON.parse(String(stored ?? '{}')) as Record<string, unknown>);

  private hideDevelopmentToolbar = (win: Cypress.AUTWindow): void => {
    const style = win.document.createElement('style');

    style.textContent = `${this.repository.getDevelopmentToolbarSelector()} { display: none !important; }`;
    win.document.head.append(style);
  };

  private clearChatStorage = (win: Cypress.AUTWindow): void => {
    win.localStorage.removeItem(this.repository.getSessionStorageKey());
    win.localStorage.removeItem(this.repository.getAgentStorageKey());
  };
}
