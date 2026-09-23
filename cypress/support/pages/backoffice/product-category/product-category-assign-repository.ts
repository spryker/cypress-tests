export interface ProductCategoryAssignRepository {
  getAvailableProductsSearchInput(): Cypress.Chainable;
  getAvailableProductCheckbox(idProductAbstract: number): Cypress.Chainable;
  getAssignedProductCheckbox(idProductAbstract: number): Cypress.Chainable;
  getProductsToBeAssignedField(): Cypress.Chainable;
  getProductsToBeDeassignedField(): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
  getSuccessAlert(): Cypress.Chainable;
}
