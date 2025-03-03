import { injectable } from 'inversify';
import { CustomerOverviewRepository } from '../customer-overview-repository';

@injectable()
export class B2bMpCustomerOverviewRepository implements CustomerOverviewRepository {
  getPlacedOrderSuccessMessage = (): string =>
    'Your order has been placed successfully. You will get the order confirmation email in a few minutes.';
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
  getMyFilesLink(): Cypress.Chainable {
    return cy.get('[data-qa="my-files"]');
  }
}
