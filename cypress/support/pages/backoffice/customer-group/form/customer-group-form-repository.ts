export interface CustomerGroupFormRepository {
  getNameInput(): Cypress.Chainable;
  getCompaniesTab(): Cypress.Chainable;
  getBusinessUnitsTab(): Cypress.Chainable;
  getAvailableCompaniesSearchInput(): Cypress.Chainable;
  getAvailableBusinessUnitsSearchInput(): Cypress.Chainable;
  getAvailableCompanyCheckbox(idCompany: number): Cypress.Chainable;
  getAssignedCompanyCheckbox(idCompany: number): Cypress.Chainable;
  getAvailableBusinessUnitCheckbox(idCompanyBusinessUnit: number): Cypress.Chainable;
  getAssignedBusinessUnitCheckbox(idCompanyBusinessUnit: number): Cypress.Chainable;
  getCompanyToBeAssignedRemoveLink(idCompany: number): Cypress.Chainable;
  getCompanyToBeDeassignedRemoveLink(idCompany: number): Cypress.Chainable;
  getBusinessUnitToBeAssignedRemoveLink(idCompanyBusinessUnit: number): Cypress.Chainable;
  getBusinessUnitToBeDeassignedRemoveLink(idCompanyBusinessUnit: number): Cypress.Chainable;
  getSaveButton(): Cypress.Chainable;
}
