import { injectable } from 'inversify';
import { CustomerOverviewRepository } from '../customer-overview-repository';

@injectable()
export class SuiteCustomerOverviewRepository implements CustomerOverviewRepository {
  getPlacedOrderSuccessMessage = (): string => 'Your order has been placed successfully!';
  getLastViewOrderButton(): Cypress.Chainable {
    return cy.get('[data-qa="component order-table"]').find('tr').eq(1).contains('a', 'View Order');
  }
}
