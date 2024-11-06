import { injectable } from 'inversify';
import { CustomerOverviewRepository } from '../customer-overview-repository';

@injectable()
export class B2cMpCustomerOverviewRepository implements CustomerOverviewRepository {
  getPlacedOrderSuccessMessage = (): string =>
    'Your order has been placed successfully. You will get the order confirmation email in a few minutes. You can check and track your order in Your Account.';
  getLastViewOrderButton(): Cypress.Chainable {
    return cy.get('[data-qa="component order-table"]').find('tr').eq(1).contains('a', 'View Order');
  }
}
