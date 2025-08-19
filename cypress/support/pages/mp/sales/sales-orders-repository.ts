import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class SalesOrdersRepository {
  getFirstTableRow = (params?: Partial<Cypress.Timeoutable>): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible', params);
  getSearchSelector = (): string => '.spy-table-search-feature input[type="text"]';
  getCancelButtonSelector = (): string => 'button:contains("Cancel")';
  getShipButtonSelector = (): string => 'button:contains("Ship")';
  getSendToDistributionButtonSelector = (): string => 'button:contains("send to distribution")';
  getConfirmAtCenterButtonSelector = (): string => 'button:contains("confirm at center")';
  getDeliverButtonSelector = (): string => 'button:contains("Deliver")';
  getRefundButtonSelector = (): string => 'button:contains("Refund")';
  getDrawer = (): Cypress.Chainable => cy.get('.spy-drawer-wrapper');
}
