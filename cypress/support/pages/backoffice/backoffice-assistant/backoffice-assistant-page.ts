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

  private CONTEXT_PAGE_URL = '/product-management/edit?id-product-abstract=300';

  enableAssistant = (): Cypress.Chainable => {
    cy.visitBackoffice(this.CONFIGURATION_URL);

    cy.get(this.repository.getEnableToggleSelector()).then(($toggle) => {
      if (!($toggle[0] as HTMLInputElement).checked) {
        cy.wrap($toggle).check({ force: true });

        cy.intercept('POST', '**/configuration/manage/save').as('saveConfiguration');
        cy.get(this.repository.getSaveButtonSelector()).click();
        cy.wait('@saveConfiguration').its('response.statusCode').should('eq', 200);
      }
    });

    return cy.get(this.repository.getEnableToggleSelector()).should('be.checked');
  };

  disableAssistant = (): Cypress.Chainable => {
    cy.visitBackoffice(this.CONFIGURATION_URL);

    cy.get(this.repository.getEnableToggleSelector()).then(($toggle) => {
      if (($toggle[0] as HTMLInputElement).checked) {
        cy.wrap($toggle).uncheck({ force: true });

        cy.intercept('POST', '**/configuration/manage/save').as('saveConfiguration');
        cy.get(this.repository.getSaveButtonSelector()).click();
        cy.wait('@saveConfiguration').its('response.statusCode').should('eq', 200);
      }
    });

    return cy.get(this.repository.getEnableToggleSelector()).should('not.be.checked');
  };

  visitDashboard = (): Cypress.Chainable => {
    cy.intercept('GET', '**/dashboard').as('dashboardDocument');
    cy.visitBackoffice(this.PAGE_URL);

    return cy.wait('@dashboardDocument');
  };

  getHistoriesEndpointPath = (): string => this.repository.getHistoriesPath();

  clearWidgetPanelState = (): Cypress.Chainable =>
    cy.window().then((win): void => win.localStorage.removeItem(this.repository.getWidgetStateStorageKey()));

  getWidgetToggleLabel = (): string => this.repository.getWidgetToggleLabel();

  getGreetingText = (): string => this.repository.getGreetingText();

  getInputPlaceholder = (): string => this.repository.getInputPlaceholder();

  getAutoAgentLabel = (): string => this.repository.getAutoAgentLabel();

  getOrderManagementAgentLabel = (): string => this.repository.getOrderManagementAgentLabel();

  getTransportFailureText = (): string => this.repository.getTransportFailureText();

  getUnsupportedFileTypeText = (): string => this.repository.getUnsupportedFileTypeText();

  getHistoriesEmptyText = (): string => this.repository.getHistoriesEmptyText();

  getValidationGlossaryKey = (): string => this.repository.getValidationGlossaryKey();

  getInvalidCsrfToken = (): string => this.repository.getInvalidCsrfToken();

  visitSales = (): Cypress.Chainable => {
    cy.intercept('GET', '**/sales').as('salesDocument');
    cy.visitBackoffice('/sales');

    return cy.wait('@salesDocument');
  };

  visitContextPage = (): Cypress.Chainable => {
    cy.intercept('GET', '**/product-management/edit**').as('contextPageDocument');
    cy.visitBackoffice(this.CONTEXT_PAGE_URL);

    return cy.wait('@contextPageDocument');
  };

  openPanel = (): Cypress.Chainable => {
    this.getWidgetToggle().should('be.visible').click();

    return this.getWidgetPanel().should('have.class', this.repository.getWidgetPanelOpenClass());
  };

  attachFile = (filePath: string | string[]): Cypress.Chainable =>
    cy.get(this.repository.getWidgetFileInputSelector()).selectFile(filePath, { force: true });

  addFormContext = (): Cypress.Chainable => this.getWidgetFormContextSuggestion().click();

  selectAgent = (agent: string): Cypress.Chainable => this.getWidgetAgentSelect().select(agent);

  typeMessage = (message: string): Cypress.Chainable => this.getWidgetInput().clear().type(message);

  send = (): Cypress.Chainable => this.getWidgetSend().click();

  getWidgetToggle = (): Cypress.Chainable => cy.get(this.repository.getWidgetToggleSelector());

  getWidgetPanel = (): Cypress.Chainable => cy.get(this.repository.getWidgetPanelSelector());

  getWidgetAgentSelect = (): Cypress.Chainable => cy.get(this.repository.getWidgetAgentSelectSelector());

  getWidgetAgentBadge = (): Cypress.Chainable => cy.get(this.repository.getWidgetAgentBadgeSelector());

  getWidgetInput = (): Cypress.Chainable => cy.get(this.repository.getWidgetInputSelector());

  getWidgetSend = (): Cypress.Chainable => cy.get(this.repository.getWidgetSendSelector());

  getWidgetHistoryButton = (): Cypress.Chainable => cy.get(this.repository.getWidgetHistoryButtonSelector());

  getWidgetNewChat = (): Cypress.Chainable => cy.get(this.repository.getWidgetNewChatSelector());

  getWidgetAttach = (): Cypress.Chainable => cy.get(this.repository.getWidgetAttachSelector());

  getWidgetMessages = (): Cypress.Chainable => cy.get(this.repository.getWidgetMessagesSelector());

  getWidgetRetryButton = (): Cypress.Chainable => cy.get(this.repository.getWidgetRetryButtonSelector());

  getWidgetAttachmentsPreview = (): Cypress.Chainable => cy.get(this.repository.getWidgetAttachmentsPreviewSelector());

  getWidgetAttachmentChip = (): Cypress.Chainable =>
    this.getWidgetAttachmentsPreview().find(this.repository.getWidgetAttachmentChipSelector());

  getWidgetAttachmentChipName = (): Cypress.Chainable =>
    this.getWidgetAttachmentChip().find(this.repository.getWidgetAttachmentChipNameSelector());

  getWidgetMessageAttachmentPill = (): Cypress.Chainable =>
    this.getWidgetMessages().find(this.repository.getWidgetMessageAttachmentPillSelector());

  private getWidgetContextSuggestions = (): Cypress.Chainable =>
    cy.get(this.repository.getWidgetContextSuggestionsSelector());

  getWidgetFormContextSuggestion = (): Cypress.Chainable =>
    this.getWidgetContextSuggestions()
      .find(this.repository.getWidgetFormContextSuggestionLabelSelector())
      .parents('button')
      .first();

  getWidgetFormContextSuggestionLabel = (): Cypress.Chainable =>
    this.getWidgetContextSuggestions().find(this.repository.getWidgetFormContextSuggestionLabelSelector());

  getWidgetContextChip = (): Cypress.Chainable =>
    this.getWidgetContextSuggestions().find(this.repository.getWidgetContextChipSelector());

  getWidgetContextChipName = (): Cypress.Chainable =>
    this.getWidgetContextChip().find(this.repository.getWidgetContextChipNameSelector());

  interceptPromptWithFailure = (): Cypress.Chainable =>
    cy
      .intercept('POST', this.repository.getPromptEndpoint(), {
        statusCode: 503,
        body: { errors: [{ message: 'AI provider unavailable' }] },
      })
      .as('assistantPrompt');

  interceptPromptWithSseEvents = (events: Array<Record<string, unknown>>): Cypress.Chainable =>
    cy
      .intercept('POST', this.repository.getPromptEndpoint(), {
        statusCode: 200,
        headers: { 'content-type': 'text/event-stream' },
        body: events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join(''),
      })
      .as('assistantPrompt');

  repositoryPromptPath = (): string => this.repository.getPromptPath();

  repositoryDetailPath = (): string => this.repository.getDetailPath();

  repositoryDeletePath = (): string => this.repository.getDeletePath();

  readCsrfToken = (): Cypress.Chainable<string> =>
    cy
      .window()
      .then((win) =>
        String(
          (win as { BackofficeAssistantConfig?: { csrfToken?: string } }).BackofficeAssistantConfig?.csrfToken ?? ''
        )
      );

  interceptRealPrompt = (): Cypress.Chainable =>
    cy.intercept('POST', this.repository.getPromptEndpoint()).as('assistantRealPrompt');

  interceptHistories = (): Cypress.Chainable =>
    cy.intercept('GET', this.repository.getHistoriesEndpoint()).as('assistantHistories');

  interceptDetail = (): Cypress.Chainable =>
    cy.intercept('GET', this.repository.getDetailEndpoint()).as('assistantDetail');

  interceptDelete = (): Cypress.Chainable =>
    cy.intercept('POST', this.repository.getDeleteEndpoint()).as('assistantDelete');

  openHistories = (): Cypress.Chainable => {
    this.getWidgetHistoryButton().click();

    return this.getWidgetHistories().should('not.have.attr', 'hidden');
  };

  newChat = (): Cypress.Chainable => this.getWidgetNewChat().click();

  deleteFirstHistoryItem = (): Cypress.Chainable => this.getWidgetFirstHistoryItemDelete().click();

  clickFirstHistoryItem = (): Cypress.Chainable => this.getWidgetHistoryItem().first().click();

  getWidgetAiMessage = (options?: Partial<Cypress.Timeoutable>): Cypress.Chainable =>
    this.getWidgetMessages().find(this.repository.getWidgetAiMessageSelector(), options);

  getWidgetUserMessage = (): Cypress.Chainable =>
    this.getWidgetMessages().find(this.repository.getWidgetUserMessageSelector());

  getWidgetReasoningMessage = (): Cypress.Chainable =>
    this.getWidgetMessages().find(this.repository.getWidgetReasoningMessageSelector());

  getWidgetToolCallMessage = (options?: Partial<Cypress.Timeoutable>): Cypress.Chainable =>
    this.getWidgetMessages().find(this.repository.getWidgetToolCallMessageSelector(), options);

  getWidgetToolCallNameSelector = (): string => this.repository.getWidgetToolCallNameSelector();

  getWidgetToolCallArgs = (): Cypress.Chainable =>
    this.getWidgetToolCallMessage().find(this.repository.getWidgetToolCallArgsSelector());

  getWidgetToolCallResultToggle = (): Cypress.Chainable =>
    this.getWidgetToolCallMessage().find(this.repository.getWidgetToolCallResultToggleSelector());

  getWidgetHistoriesEmpty = (): Cypress.Chainable => cy.get(this.repository.getWidgetHistoriesEmptySelector());

  removeFirstAttachmentChip = (): Cypress.Chainable =>
    this.getWidgetAttachmentChip().first().find(this.repository.getWidgetAttachmentChipRemoveSelector()).click();

  interceptHistoriesWith = (
    histories: Array<Record<string, unknown>>,
    availableAgents: string[] = []
  ): Cypress.Chainable =>
    cy
      .intercept('GET', this.repository.getHistoriesEndpoint(), {
        statusCode: 200,
        body: { histories, available_agents: availableAgents.map((name) => ({ name, description: '' })) },
      })
      .as('assistantHistories');

  interceptDeleteSuccess = (): Cypress.Chainable =>
    cy
      .intercept('POST', this.repository.getDeleteEndpoint(), { statusCode: 200, body: { success: true } })
      .as('assistantDelete');

  getWidgetHistories = (): Cypress.Chainable => cy.get(this.repository.getWidgetHistoriesSelector());

  getWidgetHistoriesList = (): Cypress.Chainable => cy.get(this.repository.getWidgetHistoriesListSelector());

  getWidgetHistoryItem = (): Cypress.Chainable =>
    this.getWidgetHistoriesList().find(this.repository.getWidgetHistoryItemSelector());

  getWidgetFirstHistoryItemDelete = (): Cypress.Chainable =>
    this.getWidgetHistoryItem().first().find(this.repository.getWidgetHistoryItemDeleteSelector());

  getFormFillTargetField = (fieldName: string): Cypress.Chainable =>
    cy.get(this.repository.getFormFillTargetFieldSelector(fieldName));

  expandFormFillTargetFieldLocale = (fieldName: string): Cypress.Chainable =>
    this.getFormFillTargetField(fieldName).then(($field): void => {
      if ($field.is(':visible')) {
        return;
      }

      cy.wrap($field).closest('.ibox').find(this.repository.getIboxCollapseLinkSelector()).first().click();
    });
}
