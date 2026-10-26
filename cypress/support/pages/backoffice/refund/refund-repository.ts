export interface RefundRepository {
  getRefundTable(): Cypress.Chainable;
  getRefundRows(): Cypress.Chainable;
  getRefundAmountCells(): Cypress.Chainable;
  getItemTotalAmountCells(): Cypress.Chainable;
  getItemTotalAmountCellsBySku(sku: string): Cypress.Chainable;
  getRawAmountAttribute(): string;
}
