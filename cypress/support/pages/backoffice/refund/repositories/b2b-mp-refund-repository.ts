import { injectable } from 'inversify';
import { RefundRepository } from '../refund-repository';

@injectable()
export class B2bMpRefundRepository implements RefundRepository {
  // Both the refund rows and the order-item rows publish their amount in minor units on a
  // `data-qa-raw` attribute, which is what the amounts are compared on — the rendered text is
  // locale- and currency-formatted and would make the comparison brittle.
  private RAW_AMOUNT_ATTRIBUTE = 'data-qa-raw';

  private REFUND_ROW = 'table[data-qa="refund-list"] tbody tr[data-qa="refund-row"]';

  getRefundTable(): Cypress.Chainable {
    return cy.get('.dt-container');
  }

  getRefundRows(): Cypress.Chainable {
    return cy.get(this.REFUND_ROW);
  }

  getRefundAmountCells(): Cypress.Chainable {
    return cy.get(`${this.REFUND_ROW} td[data-qa="refund-amount-raw"]`);
  }

  getItemTotalAmountCells(): Cypress.Chainable {
    return cy.get('table[data-qa="order-item-list"] tbody td[data-qa="item-total-amount"]');
  }

  getItemTotalAmountCellsBySku(sku: string): Cypress.Chainable {
    return cy.get(
      `table[data-qa="order-item-list"] tbody tr:has(div.sku:contains("${sku}")) td[data-qa="item-total-amount"]`
    );
  }

  getRawAmountAttribute(): string {
    return this.RAW_AMOUNT_ATTRIBUTE;
  }
}
