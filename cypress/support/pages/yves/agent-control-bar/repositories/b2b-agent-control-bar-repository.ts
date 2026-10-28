import { injectable } from 'inversify';
import { AgentControlBarRepository } from '../agent-control-bar-repository';

/**
 * The b2b id runs on two storefront themes: the classic agent control bar of the B2B shop and the
 * header agent control of the B2B marketplace shop. Every selector matches exactly one of them.
 */
@injectable()
export class B2bAgentControlBarRepository implements AgentControlBarRepository {
  getCustomerSearchInput = (): Cypress.Chainable =>
    cy.get(
      'agent-control-bar .js-autocomplete-form__input, .header__agent-pill-desktop agent-control .js-autocomplete-form__input'
    );

  getSuggestion = (email: string): Cypress.Chainable =>
    cy.get(
      [
        `agent-control-bar li.customer-list__container-item[data-value="${email}"]`,
        `.header__agent-pill-desktop agent-control li.customer-list__container-item[data-value="${email}"]`,
      ].join(', ')
    );

  // Only the classic bar asks for a confirmation; the header agent control submits on the pick.
  getConfirmButtonSelector = (): string => 'agent-control-bar button.button--success';

  getActiveAssistanceIndicator = (): Cypress.Chainable =>
    cy.get('agent-control-bar a[href*="_switch_user=_exit"], .header__agent-pill-desktop .agent-control__chip--active');

  getEndAssistanceLink = (): Cypress.Chainable => cy.get('agent-control-bar a[href*="_switch_user=_exit"]');

  getCustomerAutocompleteUrl = (): string => '**/agent-widget/customer-autocomplete**';
}
