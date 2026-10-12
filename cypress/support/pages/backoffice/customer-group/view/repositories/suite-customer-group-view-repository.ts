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

  getCompanyEditButton(idCompany: number): Cypress.Chainable {
    return cy.get(`#assigned-company-table a[href="/company-gui/edit-company/index?id-company=${idCompany}"]`, {
      timeout: 20000,
    });
  }

  getBusinessUnitEditButton(idCompanyBusinessUnit: number): Cypress.Chainable {
    return cy.get(
      `#assigned-company-business-unit-table a[href="/company-business-unit-gui/edit-company-business-unit?id-company-business-unit=${idCompanyBusinessUnit}"]`,
      { timeout: 20000 }
    );
  }
}
