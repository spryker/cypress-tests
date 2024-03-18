export interface MerchantRelationRequestCreateRepository {
  getMerchantSelect(): Cypress.Chainable;
  getBusinessUnitOwnerSelect(): Cypress.Chainable;
  getBusinessUnitCheckboxes(): Cypress.Chainable;
  getRequestNoteInput(): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
}
