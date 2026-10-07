import { injectable } from 'inversify';
import { CustomerGroupViewRepository } from '../customer-group-view-repository';

@injectable()
export class SuiteCustomerGroupViewRepository implements CustomerGroupViewRepository {
  getSuccessMessage(): Cypress.Chainable {
    return cy.get('[data-qa="success-message"]');
  }

  getCompanyTable(): Cypress.Chainable {
    return cy.get('#assigned-company-table', { timeout: 20000 });
  }

  getCompanyTableCheckboxes(): Cypress.Chainable {
    return cy.get('#assigned-company-table input[type="checkbox"]');
  }

  getBusinessUnitTable(): Cypress.Chainable {
    return cy.get('#assigned-company-business-unit-table', { timeout: 20000 });
  }

  getBusinessUnitTableCheckboxes(): Cypress.Chainable {
    return cy.get('#assigned-company-business-unit-table input[type="checkbox"]');
  }
}
