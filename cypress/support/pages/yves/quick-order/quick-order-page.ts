import { autoWired } from '@utils';
import { injectable } from 'inversify';
import { YvesPage } from '@pages/yves';

const VERIFIED_ROW_TIMEOUT_MS = 30000;

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

  // Verifying a pasted order reloads the page with a row per product: until then the buttons would submit the empty form of
  // the page before and cancel the verification. The row's tracking details name the product once it is there.
  waitForTrackedRow = (sku: string): void => {
    cy.get(`.quick-order-row [tracking-details*="${sku}"]`, { timeout: VERIFIED_ROW_TIMEOUT_MS });
  };

  addRowsToCart = (): void => {
    cy.get('button[name="addToCart"]').click();
  };

  addRowsToShoppingList = (name: string): void => {
    cy.get('select[name="idShoppingList"]').select(name);
    cy.get('button[name="addToShoppingList"]').click();
  };
}
