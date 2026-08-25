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

  // Unlike the item and refund amounts, Sales renders the order's totals money-formatted with no
  // raw attribute. The grand total is the second bold figure of the first row in .grandTotal-row,
  // the first being its label.
  getGrandTotalValue = (): Cypress.Chainable => cy.get('.grandTotal-row .row').first().find('b').last();

  // Sales prints the billing address as the <dd> following a "Billing address" <dt>, with no
  // data-qa, so the term is what identifies it.
  getBillingAddress = (): Cypress.Chainable => cy.get('dt:contains("Billing address") + dd');

  // ShipmentGui prints the shipment's address as a plain <p> led by a bold "Delivery Address:"
  // label, with no data-qa of its own, so the label is what identifies it.
  getShipmentDeliveryAddresses = (): Cypress.Chainable => cy.get('p:has(b:contains("Delivery Address"))');

  // The comments a customer wrote on the cart reach the back office through CommentSalesConnector,
  // which renders them in .comment-wrapper. Not to be confused with Sales' own .order-details-chat:
  // that box reads spy_sales_order_comment, a separate system a storefront comment never lands in.
  getOrderComments = (): Cypress.Chainable => cy.get('.comment-wrapper');

  // The non-marketplace shops render each item's manual events in a .oms-trigger-form, the
  // marketplace ones in a named event_item_trigger_form, so a row's event button is looked up
  // under both. Triggering per item is what leaves the order's other items where they were.
  getOrderItemOmsButtonSelector = (sku: string, state: string): string =>
    ['form.oms-trigger-form', 'form[name="event_item_trigger_form"]']
      .map(
        (form) =>
          `[data-qa="order-item-list"] tbody tr:has(div.sku:contains("${sku}")) ${form} button:contains("${state}")`
      )
      .join(', ');

  // The state cell renders the current state as a link to the state-machine drawing and the
  // superseded states as plain divs below it, so the link text is the state the item is in now.
  getOrderItemStateSelector = (state: string, sku: string): string =>
    `[data-qa="order-item-list"] tbody tr:has(div.sku:contains("${sku}")) td.state-history a:contains("${state}")`;
}
