import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ListShipmentMethodRepository {
  getEditButtonSelector = (): string => 'a:contains("Edit")';
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '[type="search"]';

  getStoreCellSelector = (): string => '.label-primary';
}
