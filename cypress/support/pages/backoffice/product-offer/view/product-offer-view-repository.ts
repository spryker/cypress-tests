import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductOfferViewRepository {
  getApprovalStatusContainer = (): Cypress.Chainable => cy.get('[data-qa="product-offer-approval-status"]');
  getStatusContainer = (): Cypress.Chainable => cy.get('[data-qa="product-offer-status"]');
  getStoreContainer = (): Cypress.Chainable => cy.get('[data-qa="product-offer-store"]');
  getProductSkuContainer = (): Cypress.Chainable => cy.get('[data-qa="product-offer-product-sku"]');
  getMerchantNameContainer = (): Cypress.Chainable => cy.get('[data-qa="merchant-name"]');
  getValidFromContainer = (): Cypress.Chainable => cy.get('[data-qa="product-offer-valid-from"]');
  getValidToContainer = (): Cypress.Chainable => cy.get('[data-qa="product-offer-valid-to"]');
  getProductOfferServicePointContainer = (): Cypress.Chainable => cy.get('[data-qa="product-offer-service-point"]');

  getStockTable = (): Cypress.Chainable => cy.get('.table.table--expand');
  getStockTableRows = (): Cypress.Chainable => this.getStockTable().find('tbody > tr');
  getStockNameCell = (row: number): Cypress.Chainable => this.getStockTableRows().eq(row).find('td').eq(0);
  getStockQuantityCell = (row: number): Cypress.Chainable => this.getStockTableRows().eq(row).find('td').eq(1);
  getStockNeverOutOfStockCell = (row: number): Cypress.Chainable => this.getStockTableRows().eq(row).find('td').last();
}
