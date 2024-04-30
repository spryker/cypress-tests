export interface CustomOrderReferenceCartRepository {
  getCartUpsellingAjaxLoader(): Cypress.Chainable;
  getCustomOrderReferenceInput(): Cypress.Chainable;
  getCustomOrderReferenceSubmitButton(): Cypress.Chainable;
  getCustomOrderReferenceAjaxLoader(): Cypress.Chainable;
}
