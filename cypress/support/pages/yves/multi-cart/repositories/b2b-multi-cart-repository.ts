import { injectable } from 'inversify';

import { MultiCartRepository } from '../multi-cart-repository';

@injectable()
export class B2bMultiCartRepository implements MultiCartRepository {
  getCreateCartNameInput = (): Cypress.Chainable => cy.get('#quoteForm_name');
  getCreateCartForm = (): Cypress.Chainable => cy.get('form[name=quoteForm]');
  getQuoteTable = (): Cypress.Chainable => cy.get('[data-qa="component quote-table"]');
  // The redesigned B2B header puts the mini cart in a cart pill, the classic one in the user navigation.
  getMiniCartRadios = (): Cypress.Chainable =>
    cy.get(
      '[data-qa="component header-cart-pill"] [data-qa="component mini-cart-detail"], [data-qa="component user-navigation"] [data-qa="component mini-cart-detail"]'
    );
}
