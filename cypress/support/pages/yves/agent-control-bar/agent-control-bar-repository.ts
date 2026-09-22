import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AgentControlBarRepository {
  // The visible field carries no name; the form submits a hidden _switch_user input that the
  // autocomplete fills when a suggestion is chosen, which is why the suggestion has to be clicked.
  getCustomerSearchInput = (): Cypress.Chainable => cy.get('agent-control-bar .js-autocomplete-form__text-input');

  getSuggestion = (email: string): Cypress.Chainable =>
    cy.get(`agent-control-bar li.customer-list__container-item[data-value="${email}"]`);

  getConfirmButton = (): Cypress.Chainable => cy.get('agent-control-bar button.button--success');

  getEndAssistanceLink = (): Cypress.Chainable => cy.get('agent-control-bar a[href*="_switch_user=_exit"]');

  getCustomerAutocompleteUrl = (): string => '**/agent-widget/customer-autocomplete**';
}
