import { injectable } from 'inversify';
import { CustomOrderReferenceCartRepository } from '../custom-order-reference-cart-repository';

@injectable()
export class SuiteCustomOrderReferenceCartRepository implements CustomOrderReferenceCartRepository {
  getCartUpsellingAjaxLoader = (): Cypress.Chainable =>
    cy.get('[data-qa="component cart-upselling"] [data-qa="component ajax-loader"]', { timeout: 10000 });
  getCustomOrderReferenceInput = (): Cypress.Chainable =>
    cy.get('[data-qa="component order-custom-reference-form"] input[type=text]');
  getCustomOrderReferenceSubmitButton = (): Cypress.Chainable =>
    cy.get('[data-qa="component order-custom-reference-form"] button[type=submit]');
  getCustomOrderReferenceAjaxLoader = (): Cypress.Chainable =>
    cy.get('[data-qa="component ajax-loader order-custom-reference-ajax-loader"]');
}
