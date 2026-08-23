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

  // The state cell renders the current state as a link to the state-machine drawing and the
  // superseded states as plain divs below it, so the link text is the state the item is in now.
  getOrderItemStateSelector = (state: string): string => `td.state-history a:contains("${state}")`;
}
