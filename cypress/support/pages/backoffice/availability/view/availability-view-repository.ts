import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AvailabilityViewRepository {
  getVariantFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getVariantEditStockButtonSelector = (): string => 'a:contains("Edit Stock")';
  getReservedProductsValue = (): Cypress.Chainable => cy.contains('b', 'Reserved Products').parent().parent().find('p').last();
}
