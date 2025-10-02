import { injectable } from 'inversify';
import { OrderRepository } from '../order-repository';

@injectable()
export class SuiteOrderRepository implements OrderRepository {
  getOrderBusinessUnitFilter(): Cypress.Chainable {
    return this.getOrderFilters().find('#orderSearchForm_filters_companyBusinessUnit');
  }
  getOrderFilterApplyButton(): Cypress.Chainable {
    return this.getOrderFilters().find('button:contains("Apply")');
  }
  getEditOrderButton(): Cypress.Chainable {
    return this.getEditOrderForm().find('button');
  }
  getEditOrderConfirmButton(): Cypress.Chainable {
    return cy.get('button:contains("Clear Cart & Continue")');
  }
  getEditOrderForm(): Cypress.Chainable {
    return cy.get('[data-qa="component remote-form-submit"]:contains("Edit Order")');
  }
  getOrderFilters(): Cypress.Chainable {
    return cy.get('[data-qa="component order-filters"]');
  }
}
