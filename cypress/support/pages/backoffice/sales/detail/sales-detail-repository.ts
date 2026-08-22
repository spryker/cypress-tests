import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class SalesDetailRepository {
  getTriggerOmsDivSelector = (): string => '.col-md-12 > .row > .col-lg-12 > .ibox > .ibox-content';
  getOmsButtonSelector = (action: string): string => `button:contains("${action}")`;
  getReturnButton = (): Cypress.Chainable => cy.get('.title-action').find('a:contains("Return")');

  // ShipmentGui renders one of these tables per shipment on the order detail page, so the count
  // of them is the order's shipment count.
  getOrderItemTables = (): Cypress.Chainable => cy.get('[data-qa="order-item-list"]');
}
