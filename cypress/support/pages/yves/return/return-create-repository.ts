import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ReturnCreateRepository {
  // Every returnable line of the order renders as its own .box carrying the item's SKU, so the SKU
  // is what identifies the line whose checkbox puts the item in the return. A line the OMS does not
  // consider returnable renders that checkbox disabled rather than hiding it.
  getReturnItemBlock = (sku: string): Cypress.Chainable => cy.contains('small', sku).closest('.box');

  getReturnItemCheckboxSelector = (): string => 'input.js-return-create__trigger-state-toggler';

  // SalesReturnPage ships the submit button disabled; its own JS enables it once a line is ticked.
  getSubmitButton = (): Cypress.Chainable => cy.get('button.js-return-create__target-state-toggler');
}
