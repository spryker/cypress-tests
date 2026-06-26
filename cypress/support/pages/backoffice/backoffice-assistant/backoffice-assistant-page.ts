import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { BackofficeAssistantRepository } from './backoffice-assistant-repository';

@injectable()
@autoWired
export class BackofficeAssistantPage extends BackofficePage {
  @inject(REPOSITORIES.BackofficeAssistantRepository) private repository: BackofficeAssistantRepository;

  protected PAGE_URL = '/dashboard';

  private CONFIGURATION_URL = '/configuration/manage?feature=ai_commerce&tab=backoffice_assistant';

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

  getWidgetToggle = (): Cypress.Chainable => cy.get(this.repository.getWidgetToggleSelector());

  getWidgetPanel = (): Cypress.Chainable => cy.get(this.repository.getWidgetPanelSelector());

  getWidgetAgentSelect = (): Cypress.Chainable => cy.get(this.repository.getWidgetAgentSelectSelector());

  getWidgetInput = (): Cypress.Chainable => cy.get(this.repository.getWidgetInputSelector());

  getWidgetSend = (): Cypress.Chainable => cy.get(this.repository.getWidgetSendSelector());

  getWidgetHistoryButton = (): Cypress.Chainable => cy.get(this.repository.getWidgetHistoryButtonSelector());

  getWidgetNewChat = (): Cypress.Chainable => cy.get(this.repository.getWidgetNewChatSelector());

  getWidgetAttach = (): Cypress.Chainable => cy.get(this.repository.getWidgetAttachSelector());
}
