import { injectable } from 'inversify';
import { AgentControlBarRepository } from '../agent-control-bar-repository';

@injectable()
export class B2cMpAgentControlBarRepository implements AgentControlBarRepository {
  // The B2C theme overrides the autocomplete field (ShopUi autocomplete-form.twig): the visible input is named
  // query and the form submits the hidden _switch_user input the autocomplete fills when a suggestion is chosen.
  getCustomerSearchInput = (): Cypress.Chainable => cy.get('agent-control-bar .js-autocomplete-form__input');

  getSuggestion = (email: string): Cypress.Chainable =>
    cy.get(`agent-control-bar li.customer-list__container-item[data-value="${email}"]`);

  getConfirmButtonSelector = (): string => 'agent-control-bar button.button--success';

  getActiveAssistanceIndicator = (): Cypress.Chainable => this.getEndAssistanceLink();

  getEndAssistanceLink = (): Cypress.Chainable => cy.get('agent-control-bar a[href*="_switch_user=_exit"]');

  getCustomerAutocompleteUrl = (): string => '**/agent-widget/customer-autocomplete**';
}
