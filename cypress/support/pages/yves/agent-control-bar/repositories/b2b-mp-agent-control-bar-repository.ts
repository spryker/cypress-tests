import { injectable } from 'inversify';
import { AgentControlBarRepository } from '../agent-control-bar-repository';

@injectable()
export class B2bMpAgentControlBarRepository implements AgentControlBarRepository {
  // The agent control sits in the header pill and again in the side drawer; the header one is the
  // desktop copy. Its search lives in a popover that only opens on hover or focus.
  getCustomerSearchInput = (): Cypress.Chainable =>
    cy.get('.header__agent-pill-desktop agent-control .js-autocomplete-form__input');

  getSuggestion = (email: string): Cypress.Chainable =>
    cy.get(`.header__agent-pill-desktop agent-control li.customer-list__container-item[data-value="${email}"]`);

  // Picking a suggestion submits the switch on its own; there is no confirm button.
  getConfirmButtonSelector = (): string => '';

  getActiveAssistanceIndicator = (): Cypress.Chainable =>
    cy.get('.header__agent-pill-desktop .agent-control__chip--active');

  // The agent control only offers to end the whole agent session, never to step back out of the customer's.
  getEndAssistanceLink = (): Cypress.Chainable => cy.get('agent-control a[href*="_switch_user=_exit"]');

  getCustomerAutocompleteUrl = (): string => '**/agent-widget/customer-autocomplete**';
}
