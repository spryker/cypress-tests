import { injectable } from 'inversify';
import { CustomOrderReferenceCartRepository } from '../custom-order-reference-cart-repository';

@injectable()
export class SuiteCustomOrderReferenceCartRepository implements CustomOrderReferenceCartRepository {
  getCustomOrderReferenceInput = (): Cypress.Chainable =>
    cy.get('[data-qa="component order-custom-reference-form"] input[type=text]');
  getCustomOrderReferenceSubmitButton = (): Cypress.Chainable =>
    cy.get('[data-qa="component order-custom-reference-form"] button[type=submit]');
}
