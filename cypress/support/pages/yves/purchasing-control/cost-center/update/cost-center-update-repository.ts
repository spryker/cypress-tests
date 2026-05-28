export interface CostCenterUpdateRepository {
  getNameInput(): Cypress.Chainable;
  getDescriptionTextarea(): Cypress.Chainable;
  getIsActiveCheckbox(): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
  getSuccessFlashMessage(): Cypress.Chainable;
}
