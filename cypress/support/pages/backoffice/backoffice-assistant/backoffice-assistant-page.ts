import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { BackofficeAssistantRepository } from './backoffice-assistant-repository';

@injectable()
@autoWired
export class BackofficeAssistantPage extends BackofficePage {
  @inject(BackofficeAssistantRepository) private repository: BackofficeAssistantRepository;

  protected PAGE_URL = '/dashboard';

  private CONFIGURATION_URL = '/configuration/manage?feature=ai_commerce&tab=backoffice_assistant';

  private CONTEXT_PAGE_SKU = 'M53235';

  enableAssistant = (): Cypress.Chainable => this.setAssistantEnabled(true);

  disableAssistant = (): Cypress.Chainable => this.setAssistantEnabled(false);

  visitDashboard = (): Cypress.Chainable => {
    cy.intercept('GET', '**/dashboard').as('dashboardDocument');
    cy.visitBackoffice(this.PAGE_URL, { onBeforeLoad: this.clearChatStorage });

    return cy.wait('@dashboardDocument');
  };

  visitSales = (): Cypress.Chainable => {
    cy.intercept('GET', '**/sales').as('salesDocument');
    cy.visitBackoffice('/sales', { onBeforeLoad: this.clearChatStorage });

    return cy.wait('@salesDocument');
  };

  visitContextPage = (): Cypress.Chainable => {
    cy.intercept('GET', '**/product-management/edit**').as('contextPageDocument');

    this.resolveProductAbstractIdBySku(this.CONTEXT_PAGE_SKU).then((id) => {
      cy.visitBackoffice(`/product-management/edit?id-product-abstract=${id}`, {
        onBeforeLoad: this.clearChatStorage,
      });
    });

    return cy.wait('@contextPageDocument');
  };

  clearWidgetPanelState = (): Cypress.Chainable => cy.window().then((win): void => this.clearChatStorage(win));

  getTriggerLabel = (): string => this.repository.getTriggerLabel();

  getGreetingText = (): string => this.repository.getGreetingText();

  getInputPlaceholder = (): string => this.repository.getInputPlaceholder();

  getAutoAgentLabel = (): string => this.repository.getAutoAgentLabel();

  getOrderManagementAgentLabel = (): string => this.repository.getOrderManagementAgentLabel();

  getGenericErrorText = (): string => this.repository.getGenericErrorText();

  getUnsupportedFileTypeText = (): string => this.repository.getUnsupportedFileTypeText();

  getHistoriesEmptyText = (): string => this.repository.getHistoriesEmptyText();

  getValidationGlossaryKey = (): string => this.repository.getValidationGlossaryKey();

  getInvalidCsrfToken = (): string => this.repository.getInvalidCsrfToken();

  getCsrfTokenHeaderName = (): string => this.repository.getCsrfTokenHeaderName();

  getPromptUrl = (): string => this.getBackofficeAbsoluteUrl(this.repository.getPromptPath());

  getConversationsUrl = (): string => this.getBackofficeAbsoluteUrl(this.repository.getConversationsPath());

  getConversationMessagesUrl = (): string =>
    this.getBackofficeAbsoluteUrl(this.repository.getConversationMessagesPath());

  getDeleteConversationUrl = (): string => this.getBackofficeAbsoluteUrl(this.repository.getDeleteConversationPath());

  openPanel = (): Cypress.Chainable => {
    this.getTrigger().should('be.visible').click();

    return this.getChat().should('have.attr', this.repository.getPanelOpenAttribute());
  };

  closePanel = (): Cypress.Chainable => {
    cy.get(this.repository.getCloseSelector()).click();

    return this.getChat().should('not.have.attr', this.repository.getPanelOpenAttribute());
  };

  attachFile = (filePath: string | string[]): Cypress.Chainable =>
    cy.get(this.repository.getFileInputSelector()).selectFile(filePath, { force: true });

  addFormContext = (): Cypress.Chainable => this.getFormContextSuggestion().click();

  selectAgent = (agent: string): Cypress.Chainable => {
    this.getAgentSelectorToggle().click();

    return this.getAgentOption(agent).click();
  };

  typeMessage = (message: string): Cypress.Chainable => this.getInput().clear().type(message);

  send = (): Cypress.Chainable => this.getSend().click();

  newChat = (): Cypress.Chainable => {
    cy.get(this.repository.getMoreToggleSelector()).click();

    return cy.get(this.repository.getNewConversationSelector()).filter(':visible').click();
  };

  openHistories = (): Cypress.Chainable => {
    cy.get(this.repository.getMoreToggleSelector()).click();
    cy.contains(this.repository.getMenuItemSelector(), this.repository.getHistoryMenuItemLabel()).click();

    return this.getHistories().should('be.visible');
  };

  deleteFirstHistoryItem = (): Cypress.Chainable => this.getFirstHistoryItemDelete().click();

  clickFirstHistoryItem = (): Cypress.Chainable =>
    this.getHistoryItem().first().find(this.repository.getHistoryItemOpenSelector()).click();

  removeFirstAttachmentChip = (): Cypress.Chainable =>
    this.getAttachmentChip().first().find(this.repository.getAttachmentChipRemoveSelector()).click();

  readStoredConversationReference = (): Cypress.Chainable<string | null> =>
    cy
      .window()
      .its('localStorage')
      .invoke('getItem', this.repository.getSessionStorageKey())
      .then((storedSession) => JSON.parse(String(storedSession ?? '{}')).conversationReference ?? null);

  readCsrfToken = (): Cypress.Chainable<string> =>
    this.getChat().then(($chat) => String($chat.attr(this.repository.getCsrfTokenAttributeName()) ?? ''));

  getChat = (): Cypress.Chainable => cy.get(this.repository.getChatSelector());

  getTrigger = (): Cypress.Chainable => cy.get(this.repository.getTriggerSelector());

  getPanel = (): Cypress.Chainable => cy.get(this.repository.getPanelSelector());

  getWelcomeText = (): Cypress.Chainable => cy.get(this.repository.getWelcomeTextSelector());

  getAgentSelectorToggle = (): Cypress.Chainable => cy.get(this.repository.getAgentSelectorToggleSelector());

  getAgentSelectorLabel = (): Cypress.Chainable => cy.get(this.repository.getAgentSelectorLabelSelector());

  getAgentOptions = (): Cypress.Chainable => cy.get(this.repository.getAgentSelectorOptionSelector());

  getAgentOption = (agent: string): Cypress.Chainable =>
    cy.contains(this.repository.getAgentSelectorOptionSelector(), agent);

  getAgentOptionLabels = (): Cypress.Chainable =>
    this.getAgentOptions().find(this.repository.getAgentSelectorOptionLabelSelector());

  getInput = (): Cypress.Chainable => cy.get(this.repository.getInputSelector());

  getSend = (): Cypress.Chainable => cy.get(this.repository.getSendSelector());

  getMoreToggle = (): Cypress.Chainable => cy.get(this.repository.getMoreToggleSelector());

  getAttachButton = (): Cypress.Chainable => cy.get(this.repository.getAttachButtonSelector());

  getTranscript = (): Cypress.Chainable => cy.get(this.repository.getTranscriptSelector());

  getAttachmentChip = (): Cypress.Chainable => cy.get(this.repository.getAttachmentChipSelector());

  getAttachmentChipName = (): Cypress.Chainable =>
    this.getAttachmentChip().find(this.repository.getAttachmentChipNameSelector());

  getMessageAttachmentPill = (): Cypress.Chainable =>
    this.getTranscript().find(this.repository.getMessageAttachmentPillSelector());

  getAttachmentNotice = (): Cypress.Chainable => cy.get(this.repository.getAttachmentNoticeSelector());

  getFormContextSuggestion = (): Cypress.Chainable => cy.get(this.repository.getFormContextSuggestionSelector());

  getFormContextChip = (): Cypress.Chainable => cy.get(this.repository.getFormContextChipSelector());

  getFormContextChipName = (): Cypress.Chainable =>
    this.getFormContextChip().find(this.repository.getFormContextNameSelector());

  getFormContextSuggestionName = (): Cypress.Chainable =>
    this.getFormContextSuggestion().find(this.repository.getFormContextNameSelector());

  getAssistantMessage = (options?: Partial<Cypress.Timeoutable>): Cypress.Chainable =>
    this.getTranscript().find(this.repository.getAssistantMessageSelector(), options);

  getUserMessage = (): Cypress.Chainable => this.getTranscript().find(this.repository.getUserMessageSelector());

  getErrorMessage = (options?: Partial<Cypress.Timeoutable>): Cypress.Chainable =>
    this.getTranscript().find(this.repository.getErrorMessageSelector(), options);

  getRetryButton = (options?: Partial<Cypress.Timeoutable>): Cypress.Chainable =>
    cy.get(this.repository.getRetryButtonSelector(), options);

  getReasoning = (): Cypress.Chainable => this.getTranscript().find(this.repository.getReasoningSelector());

  getToolCall = (options?: Partial<Cypress.Timeoutable>): Cypress.Chainable =>
    this.getTranscript().find(this.repository.getToolCallSelector(), options);

  getToolCallName = (): Cypress.Chainable => this.getToolCall().find(this.repository.getToolCallNameSelector());

  getToolCallToggle = (): Cypress.Chainable => this.getToolCall().find(this.repository.getToolCallToggleSelector());

  getHistories = (): Cypress.Chainable => cy.get(this.repository.getHistoriesSelector());

  getHistoryItem = (): Cypress.Chainable => this.getHistories().find(this.repository.getHistoryItemSelector());

  getFirstHistoryItemDelete = (): Cypress.Chainable =>
    this.getHistoryItem().first().find(this.repository.getHistoryItemDeleteSelector());

  getHistoriesEmpty = (): Cypress.Chainable => this.getHistories().find(this.repository.getHistoriesEmptySelector());

  getFormFillTargetField = (fieldName: string): Cypress.Chainable =>
    cy.get(this.repository.getFormFillTargetFieldSelector(fieldName));

  expandFormFillTargetFieldLocale = (fieldName: string): Cypress.Chainable =>
    this.getFormFillTargetField(fieldName).then(($field): void => {
      if ($field.is(':visible')) {
        return;
      }

      cy.wrap($field).closest('.ibox').find(this.repository.getIboxCollapseLinkSelector()).first().click();
    });

  interceptPromptWithFailure = (): Cypress.Chainable => {
    cy.on('uncaught:exception', (error: Error): false | void => {
      if (String(error?.message).includes(this.repository.getChatTurnFailureMessage())) {
        return false;
      }
    });

    return cy
      .intercept('POST', this.repository.getEndpointPattern(this.repository.getPromptPath()), {
        statusCode: 503,
        body: { error: 'AI provider unavailable' },
      })
      .as('assistantPrompt');
  };

  interceptPromptWithStreamEvents = (events: Array<Record<string, unknown>>): Cypress.Chainable =>
    cy
      .intercept('POST', this.repository.getEndpointPattern(this.repository.getPromptPath()), {
        statusCode: 200,
        headers: { 'content-type': 'text/event-stream' },
        body: [...events.map((event) => JSON.stringify(event)), this.repository.getStreamDoneSentinel()]
          .map((line) => `data: ${line}\n\n`)
          .join(''),
      })
      .as('assistantPrompt');

  interceptRealPrompt = (): Cypress.Chainable =>
    cy.intercept('POST', this.repository.getEndpointPattern(this.repository.getPromptPath())).as('assistantRealPrompt');

  interceptConversations = (): Cypress.Chainable =>
    cy
      .intercept('GET', this.repository.getEndpointPattern(this.repository.getConversationsPath()))
      .as('assistantConversations');

  interceptConversationMessages = (): Cypress.Chainable =>
    cy
      .intercept('GET', this.repository.getEndpointPattern(this.repository.getConversationMessagesPath()))
      .as('assistantConversationMessages');

  interceptDeleteConversation = (): Cypress.Chainable =>
    cy
      .intercept('DELETE', this.repository.getEndpointPattern(this.repository.getDeleteConversationPath()))
      .as('assistantDeleteConversation');

  interceptConversationsWith = (
    conversations: Array<Record<string, unknown>>,
    availableAgents: string[] = []
  ): Cypress.Chainable =>
    cy
      .intercept('GET', this.repository.getEndpointPattern(this.repository.getConversationsPath()), {
        statusCode: 200,
        body: {
          conversations,
          availableAgents: availableAgents.map((name) => ({ name, description: '' })),
          userSelectedAgent: null,
        },
      })
      .as('assistantConversations');

  interceptDeleteConversationSuccess = (): Cypress.Chainable =>
    cy
      .intercept('DELETE', this.repository.getEndpointPattern(this.repository.getDeleteConversationPath()), {
        statusCode: 200,
        body: { deletedCount: 1 },
      })
      .as('assistantDeleteConversation');

  private clearChatStorage = (win: Cypress.AUTWindow): void => {
    win.localStorage.removeItem(this.repository.getSessionStorageKey());
    win.localStorage.removeItem(this.repository.getAgentStorageKey());
  };

  private setAssistantEnabled = (isEnabled: boolean): Cypress.Chainable => {
    cy.visitBackoffice(this.CONFIGURATION_URL);

    cy.get(this.repository.getEnableToggleSelector()).then(($toggle) => {
      if (($toggle[0] as HTMLInputElement).checked === isEnabled) {
        return;
      }

      cy.wrap($toggle)[isEnabled ? 'check' : 'uncheck']({ force: true });

      cy.intercept('POST', '**/configuration/manage/save').as('saveConfiguration');
      cy.get(this.repository.getSaveButtonSelector()).click();
      cy.wait('@saveConfiguration').its('response.statusCode').should('eq', 200);
    });

    return cy.get(this.repository.getEnableToggleSelector()).should(isEnabled ? 'be.checked' : 'not.be.checked');
  };
}
