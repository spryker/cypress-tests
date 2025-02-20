import { injectable } from 'inversify';
import { CustomerOverviewRepository } from '../customer-overview-repository';

@injectable()
export class SuiteCustomerOverviewRepository implements CustomerOverviewRepository {
  getPlacedOrderSuccessMessage = (): string => 'Your order has been placed successfully!';
  getLastViewOrderButton(): Cypress.Chainable {
    return cy.get('[data-qa="component order-table"]').find('tr').eq(1).contains('a', 'View Order');
  }
  getOrderedProductSpan(productName: string): string {
    return `span:contains("${productName}")`;
  }
  getFirstShippingAddress(): Cypress.Chainable {
    return cy.get('[data-qa="component display-address"]').first();
  }
  getViewOrderButton(tableRowIndex: number): Cypress.Chainable {
    return cy.get('[data-qa="component order-table"]').find('tr').eq(tableRowIndex).contains('a', 'View Order');
  }
}
