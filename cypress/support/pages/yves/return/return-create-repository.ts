import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ReturnCreateRepository {
  // Every returnable line of the order renders as its own grid--justify row carrying the item's SKU -
  // a .box only in the suite, the B2B and B2C themes drop that class - so the SKU is what identifies
  // the line whose checkbox puts the item in the return. A line the OMS does not consider returnable
  // renders that checkbox disabled rather than hiding it.
  getReturnItemBlock = (sku: string): Cypress.Chainable => cy.contains('small', sku).closest('.grid--justify');

  getReturnItemCheckboxSelector = (): string => 'input.js-return-create__trigger-state-toggler';

  // SalesReturnPage ships the submit button disabled; its own JS enables it once a line is ticked.
  getSubmitButton = (): Cypress.Chainable => cy.get('button.js-return-create__target-state-toggler');
}
