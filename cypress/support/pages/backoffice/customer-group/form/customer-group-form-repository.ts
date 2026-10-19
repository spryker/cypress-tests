export interface CustomerGroupFormRepository {
  getNameInput(): Cypress.Chainable;
  getCustomersTab(): Cypress.Chainable;
  getCompaniesTab(): Cypress.Chainable;
  getBusinessUnitsTab(): Cypress.Chainable;
  getCustomersToBeAssignedTab(): Cypress.Chainable;
  getCustomersToBeDeassignedTab(): Cypress.Chainable;
  getAvailableCustomersSearchInput(): Cypress.Chainable;
  getAvailableCompaniesSearchInput(): Cypress.Chainable;
  getAvailableBusinessUnitsSearchInput(): Cypress.Chainable;
  getAvailableCustomerCheckbox(idCustomer: number): Cypress.Chainable;
  getAssignedCustomerCheckbox(idCustomer: number): Cypress.Chainable;
  getAvailableCompanyCheckbox(idCompany: number): Cypress.Chainable;
  getAssignedCompanyCheckbox(idCompany: number): Cypress.Chainable;
  getAvailableBusinessUnitCheckbox(idCompanyBusinessUnit: number): Cypress.Chainable;
  getAssignedBusinessUnitCheckbox(idCompanyBusinessUnit: number): Cypress.Chainable;
  getCustomerToBeAssignedRemoveLink(idCustomer: number): Cypress.Chainable;
  getCustomerToBeDeassignedRemoveLink(idCustomer: number): Cypress.Chainable;
  getCompanyToBeAssignedRemoveLink(idCompany: number): Cypress.Chainable;
  getCompanyToBeDeassignedRemoveLink(idCompany: number): Cypress.Chainable;
  getBusinessUnitToBeAssignedRemoveLink(idCompanyBusinessUnit: number): Cypress.Chainable;
  getBusinessUnitToBeDeassignedRemoveLink(idCompanyBusinessUnit: number): Cypress.Chainable;
  getSaveButton(): Cypress.Chainable;
  getSuccessMessage(): Cypress.Chainable;
}
