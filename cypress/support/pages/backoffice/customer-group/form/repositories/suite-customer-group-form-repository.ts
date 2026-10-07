import { injectable } from 'inversify';
import { CustomerGroupFormRepository } from '../customer-group-form-repository';

@injectable()
export class SuiteCustomerGroupFormRepository implements CustomerGroupFormRepository {
  getNameInput(): Cypress.Chainable {
    return cy.get('#customer_group_name');
  }

  getCompaniesTab(): Cypress.Chainable {
    return cy.get('[data-qa="tab-company-assignment"]');
  }

  getBusinessUnitsTab(): Cypress.Chainable {
    return cy.get('[data-qa="tab-company-business-unit-assignment"]');
  }

  getAvailableCompaniesSearchInput(): Cypress.Chainable {
    return cy.get('[data-qa="tab-content-available-companies"] [data-qa="table-search"]');
  }

  getAvailableBusinessUnitsSearchInput(): Cypress.Chainable {
    return cy.get('[data-qa="tab-content-available-company-business-units"] [data-qa="table-search"]');
  }

  getAvailableCompanyCheckbox(idCompany: number): Cypress.Chainable {
    return cy.get(`#available-company-table input[type="checkbox"][value="${idCompany}"]`, { timeout: 20000 });
  }

  getAssignedCompanyCheckbox(idCompany: number): Cypress.Chainable {
    return cy.get(`#assigned-company-table input[type="checkbox"][value="${idCompany}"]`, { timeout: 20000 });
  }

  getAvailableBusinessUnitCheckbox(idCompanyBusinessUnit: number): Cypress.Chainable {
    return cy.get(`#available-company-business-unit-table input[type="checkbox"][value="${idCompanyBusinessUnit}"]`, {
      timeout: 20000,
    });
  }

  getAssignedBusinessUnitCheckbox(idCompanyBusinessUnit: number): Cypress.Chainable {
    return cy.get(`#assigned-company-business-unit-table input[type="checkbox"][value="${idCompanyBusinessUnit}"]`, {
      timeout: 20000,
    });
  }

  getCompanyToBeAssignedRemoveLink(idCompany: number): Cypress.Chainable {
    return cy.get(`#companies-to-be-assigned-table [data-id="${idCompany}"]`);
  }

  getCompanyToBeDeassignedRemoveLink(idCompany: number): Cypress.Chainable {
    return cy.get(`#companies-to-be-de-assigned-table [data-id="${idCompany}"]`);
  }

  getBusinessUnitToBeAssignedRemoveLink(idCompanyBusinessUnit: number): Cypress.Chainable {
    return cy.get(`#company-business-units-to-be-assigned-table [data-id="${idCompanyBusinessUnit}"]`);
  }

  getBusinessUnitToBeDeassignedRemoveLink(idCompanyBusinessUnit: number): Cypress.Chainable {
    return cy.get(`#company-business-units-to-be-de-assigned-table [data-id="${idCompanyBusinessUnit}"]`);
  }

  getSaveButton(): Cypress.Chainable {
    return cy.get('form[name="customer_group"] input[type="submit"]');
  }
}
