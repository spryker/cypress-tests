import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AvailabilityEditRepository {
  getFirstStockQuantityInput = (): Cypress.Chainable => cy.get('#AvailabilityGui_stock_stocks_0_quantity');
  getFirstIsNeverOutOfStockCheckbox = (): Cypress.Chainable =>
    cy.get('#AvailabilityGui_stock_stocks_0_is_never_out_of_stock');
  getSaveButton = (): Cypress.Chainable => cy.get('[type="submit"]');
}
