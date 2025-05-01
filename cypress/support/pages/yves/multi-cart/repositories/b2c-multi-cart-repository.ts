import { injectable } from 'inversify';

import { MultiCartRepository } from '../multi-cart-repository';

@injectable()
export class B2cMultiCartRepository implements MultiCartRepository {
  getCreateCartNameInput = (): Cypress.Chainable => cy.get('#quoteForm_name');
  getCreateCartForm = (): Cypress.Chainable => cy.get('form[name=quoteForm]');
  getQuoteTable = (): Cypress.Chainable => cy.get('[data-qa="component quote-table"]');
  getMiniCartRadios = (): Cypress.Chainable =>
    cy.get('[data-qa="component mini-cart-detail"]').find('[data-qa="component mini-cart-radio"]');
}
