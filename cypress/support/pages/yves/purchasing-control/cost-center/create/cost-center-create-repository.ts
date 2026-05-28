export interface CostCenterCreateRepository {
  getNameInput(): Cypress.Chainable;
  getDescriptionTextarea(): Cypress.Chainable;
  getBusinessUnitCheckbox(idBusinessUnit: number): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
  getSuccessFlashMessage(): Cypress.Chainable;
}
