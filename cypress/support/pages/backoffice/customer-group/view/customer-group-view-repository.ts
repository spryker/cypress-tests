export interface CustomerGroupViewRepository {
  getSuccessMessage(): Cypress.Chainable;
  getCompanyTable(): Cypress.Chainable;
  getCompanyTableCheckboxes(): Cypress.Chainable;
  getBusinessUnitTable(): Cypress.Chainable;
  getBusinessUnitTableCheckboxes(): Cypress.Chainable;
  getCompanyEditButton(idCompany: number): Cypress.Chainable;
  getBusinessUnitEditButton(idCompanyBusinessUnit: number): Cypress.Chainable;
}
