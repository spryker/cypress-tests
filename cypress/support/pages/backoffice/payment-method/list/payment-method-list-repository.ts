import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class PaymentMethodListRepository {
  getEditButtonSelector = (): string => 'a:contains("Edit")';
  getMethodKeyRowSelector = (): string => 'td[class*="payment_method_key"]';
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '[type="search"]';
  getStoreCellSelector = (): string => 'td[class*="column-spy_store"]';
}
