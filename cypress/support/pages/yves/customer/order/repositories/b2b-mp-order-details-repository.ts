import { injectable } from 'inversify';
import { OrderDetailsRepository } from '../order-details-repository';

@injectable()
export class B2bMpOrderDetailsRepository implements OrderDetailsRepository {
  getReorderAllButton(): Cypress.Chainable {
    return cy.get('[data-qa="reorder-all-button"]');
  }
  getOrderReferenceBlock(): Cypress.Chainable {
    return cy.get('[data-qa="order-reference"]').invoke('text');
  }
  getReorderSelectedItemsButton(): Cypress.Chainable {
    return cy.get('[data-qa="reorder-selected-button"]');
  }
  getCartReorderItemCheckboxes(): Cypress.Chainable {
    return cy.get('input[type="checkbox"][name="sales-order-item-ids[]"]');
  }
  getEditOrderButton(): Cypress.Chainable {
    return this.getEditOrderForm().find('button');
  }
  getEditOrderConfirmButton(): Cypress.Chainable {
    return cy.get('button:contains("Clear Cart & Continue")');
  }

  getEditOrderForm(): Cypress.Chainable {
    return cy.get('[data-qa="component order-amendment"] [data-qa="component remote-form-submit"]');
  }
  getOrderDetailTableBlock(): Cypress.Chainable {
    return cy.get('[data-qa="component order-detail-table"]');
  }
  // The cancel button is a remote-form-submit: the button carries the form action as an attribute
  // and submits a form rendered elsewhere, so it is not inside a form of its own.
  getCancelOrderButton(): Cypress.Chainable {
    return cy.get('remote-form-submit[form-action*="order/cancel"] button');
  }
  getCreateReturnLink(): Cypress.Chainable {
    return cy.get('[data-qa="component return-create-link"]');
  }
}
