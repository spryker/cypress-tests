import { injectable } from 'inversify';

import { MultiCartRepository } from '../multi-cart-repository';

@injectable()
export class B2bMultiCartRepository implements MultiCartRepository {
  getCreateCartNameInput = (): Cypress.Chainable => cy.get('#quoteForm_name');
  getCreateCartForm = (): Cypress.Chainable => cy.get('form[name=quoteForm]');
  getQuoteTable = (): Cypress.Chainable => cy.get('[data-qa="component quote-table"]');
  getCartUpsellingAjaxLoader = (): Cypress.Chainable =>
    cy.get('[data-qa="component cart-upselling"] [data-qa="component ajax-loader"]', { timeout: 10000 });
}
