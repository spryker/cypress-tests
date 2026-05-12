export interface CostCenterCreateRepository {
  getNameInput(): Cypress.Chainable;
  getDescriptionTextarea(): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
  getSuccessFlashMessage(): Cypress.Chainable;
}
