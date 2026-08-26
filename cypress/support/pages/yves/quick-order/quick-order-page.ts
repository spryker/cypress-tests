import { autoWired } from '@utils';
import { injectable } from 'inversify';
import { YvesPage } from '@pages/yves';

@injectable()
@autoWired
export class QuickOrderPage extends YvesPage {
  protected PAGE_URL = '/quick-order';

  // One "<sku>,<quantity>" per line, which is what the page tells the buyer to paste in.
  verifyPastedOrder = (pastedOrder: string): void => {
    cy.get('#text_order_form_textOrder').clear();
    cy.get('#text_order_form_textOrder').type(pastedOrder);
    cy.get('button[name="textOrder"]').click();
  };

  getOrderRows = (): Cypress.Chainable => cy.get('[data-qa="component quick-order-rows"]');

  addRowsToCart = (): void => {
    cy.get('button[name="addToCart"]').click();
  };

  addRowsToShoppingList = (name: string): void => {
    cy.get('select[name="idShoppingList"]').select(name);
    cy.get('button[name="addToShoppingList"]').click();
  };
}
