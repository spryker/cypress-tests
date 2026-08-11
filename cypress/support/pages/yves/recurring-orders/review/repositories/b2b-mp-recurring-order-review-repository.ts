import { injectable } from 'inversify';
import { SuiteRecurringOrderReviewRepository } from './suite-recurring-order-review-repository';

@injectable()
export class B2bMpRecurringOrderReviewRepository extends SuiteRecurringOrderReviewRepository {
  getFlashAlert = (): Cypress.Chainable => cy.get('flash-message.flash-message--alert');

  getShipmentAddressSelect = (): Cypress.Chainable =>
    cy.get('.main-popup--open [data-qa="review-shipment-selection-address"]').first();

  getShipmentMethodSelect = (): Cypress.Chainable =>
    cy.get('.main-popup--open [data-qa="review-shipment-selection-method"]').first();
}
