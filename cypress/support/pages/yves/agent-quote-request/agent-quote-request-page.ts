import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { AgentQuoteRequestRepository } from './agent-quote-request-repository';

@injectable()
@autoWired
export class AgentQuoteRequestPage extends YvesPage {
  @inject(AgentQuoteRequestRepository) private repository: AgentQuoteRequestRepository;

  protected PAGE_URL = '/agent/quote-request';

  visitEdit = (reference: string): Cypress.Chainable => {
    cy.intercept('GET', '**/agent/quote-request/edit/**').as('agentQuoteRequestEditDocument');
    cy.visit(`${this.PAGE_URL}/edit/${reference}`);

    return cy.wait('@agentQuoteRequestEditDocument');
  };

  visitDetails = (reference: string): Cypress.Chainable => {
    cy.intercept('GET', '**/agent/quote-request/details/**').as('agentQuoteRequestDetailsDocument');
    cy.visit(`${this.PAGE_URL}/details/${reference}`);

    return cy.wait('@agentQuoteRequestDetailsDocument');
  };

  visitCustomerDetails = (reference: string): Cypress.Chainable => {
    cy.intercept('GET', '**/quote-request/details/**').as('customerQuoteRequestDetailsDocument');
    cy.visit(`/quote-request/details/${reference}`);

    return cy.wait('@customerQuoteRequestDetailsDocument');
  };

  getCartItems = (): Cypress.Chainable => cy.get(this.repository.getCartItemSelector());

  getCostPriceMolecules = (): Cypress.Chainable => cy.get(this.repository.getCostPriceMoleculeSelector());

  getCostPriceValues = (): Cypress.Chainable => cy.get(this.repository.getCostPriceValueSelector());

  getGrossMargins = (): Cypress.Chainable => cy.get(this.repository.getGrossMarginSelector());

  getGrossMarginUnavailable = (): Cypress.Chainable =>
    cy.get('body').then(($body) => $body.find(this.repository.getGrossMarginUnavailableSelector()));

  getCostPriceWarningIcon = (): Cypress.Chainable =>
    cy.get('body').then(($body) => $body.find(this.repository.getCostPriceWarningIconSelector()));

  isGrossMarginUnavailable = ($margin: JQuery<HTMLElement>): boolean =>
    $margin.hasClass(this.repository.getGrossMarginUnavailableClass());

  getCostPriceDataAttribute = (): string => this.repository.getCostPriceDataAttribute();

  getUnavailableCostPriceText = (): string => this.repository.getUnavailableCostPriceText();

  save = (): void => {
    cy.intercept('POST', '**/agent/quote-request/edit/**').as('agentQuoteRequestSave');
    this.repository.getSaveButton().click();
    cy.wait('@agentQuoteRequestSave');
  };

  recalculate = (reference: string): void => {
    this.visitEdit(reference);
    this.getCartItems().should('have.length.at.least', 1);
    this.save();
  };
}
