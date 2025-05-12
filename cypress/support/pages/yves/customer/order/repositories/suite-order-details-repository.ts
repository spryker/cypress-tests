import { injectable } from 'inversify';
import { OrderDetailsRepository } from '../order-details-repository';

@injectable()
export class SuiteOrderDetailsRepository implements OrderDetailsRepository {
  getReorderAllButton(): Cypress.Chainable {
    return cy.get('form[name="cartReorderForm"]').eq(1).find('button');
  }
  getOrderReferenceBlock(): Cypress.Chainable {
    return cy.get('li:contains("Order Id:")').find('strong').invoke('text');
  }
  getReorderSelectedItemsButton(): Cypress.Chainable {
    return cy.get('.js-cart-reorder-form__trigger');
  }
  getCartReorderItemCheckboxes(): Cypress.Chainable {
    return cy.get('input[type="checkbox"][name="sales-order-item-ids[]"]');
  }
  getEditOrderButton(): Cypress.Chainable {
    return this.getEditOrderForm().find('button');
  }
  getEditOrderForm(): Cypress.Chainable {
    return cy.get('[data-qa="component remote-form-submit"]');
  }
  getOrderDetailTableBlock(): Cypress.Chainable {
    return cy.get('[data-qa="component order-detail-table"]');
  }
}
