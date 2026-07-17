import { injectable } from 'inversify';
import { RefundRepository } from '../refund-repository';

@injectable()
export class B2bMpRefundRepository implements RefundRepository {
  getRefundTable(): Cypress.Chainable {
    return cy.get('.dt-container');
  }
}
