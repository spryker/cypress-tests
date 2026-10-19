import { injectable } from 'inversify';
import { CustomerGroupFormRepository } from '../customer-group-form-repository';

@injectable()
export class SuiteCustomerGroupFormRepository implements CustomerGroupFormRepository {
  getNameInput(): Cypress.Chainable {
    return cy.get('#customer_group_name');
  }

  getCustomersTab(): Cypress.Chainable {
    return cy.get('[data-qa="tab-customer-assignment"]');
  }

  getCompaniesTab(): Cypress.Chainable {
    return cy.get('[data-qa="tab-company-assignment"]');
  }

  getBusinessUnitsTab(): Cypress.Chainable {
    return cy.get('[data-qa="tab-company-business-unit-assignment"]');
  }

  getCustomersToBeAssignedTab(): Cypress.Chainable {
    return cy.get('#available-items-destination-tab-label');
  }

  getCustomersToBeDeassignedTab(): Cypress.Chainable {
    return cy.get('#assigned-items-destination-tab-label');
  }

  getAvailableCustomersSearchInput(): Cypress.Chainable {
    return cy.get('#available-items-source-tab [data-qa="table-search"]');
  }

  getAvailableCompaniesSearchInput(): Cypress.Chainable {
    return cy.get('[data-qa="tab-content-available-companies"] [data-qa="table-search"]');
  }

  getAvailableBusinessUnitsSearchInput(): Cypress.Chainable {
    return cy.get('[data-qa="tab-content-available-company-business-units"] [data-qa="table-search"]');
  }

  getAvailableCustomerCheckbox(idCustomer: number): Cypress.Chainable {
    return cy.get(`#available-items-source-tab input[type="checkbox"][value="${idCustomer}"]`, { timeout: 20000 });
  }

  getAssignedCustomerCheckbox(idCustomer: number): Cypress.Chainable {
    return cy.get(`#assigned-items-source-tab input[type="checkbox"][value="${idCustomer}"]`, { timeout: 20000 });
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

  getCustomerToBeAssignedRemoveLink(idCustomer: number): Cypress.Chainable {
    return cy.get(`#available-items-destination-tab-table [data-id="${idCustomer}"]`);
  }

  getCustomerToBeDeassignedRemoveLink(idCustomer: number): Cypress.Chainable {
    return cy.get(`#assigned-items-destination-tab-table [data-id="${idCustomer}"]`);
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

  getSuccessMessage(): Cypress.Chainable {
    return cy.get('[data-qa="success-message"]');
  }
}
