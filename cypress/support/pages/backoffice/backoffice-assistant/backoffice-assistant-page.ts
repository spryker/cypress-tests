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

  /**
   * Enables the Backoffice Assistant feature flag via the Configuration Management UI and saves.
   * Idempotent: only checks the toggle when it is currently off, so a re-run on an already-enabled
   * env still ends in the ON state. The Save action triggers a plain config-save POST
   * (`/configuration/manage/save`) — NOT an AI provider call.
   */
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

  visitDashboard = (): Cypress.Chainable => {
    cy.intercept('GET', '**/dashboard').as('dashboardDocument');
    cy.visitBackoffice(this.PAGE_URL);

    return cy.wait('@dashboardDocument');
  };

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

  attachFile = (filePath: string): Cypress.Chainable =>
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

  getWidgetContextSuggestions = (): Cypress.Chainable => cy.get(this.repository.getWidgetContextSuggestionsSelector());

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
}
