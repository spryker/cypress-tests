export interface ProductRelationRepository {
  getRelationKeyInput(): Cypress.Chainable;
  getRelationTypeSelect(): Cypress.Chainable;
  getProductSearchInput(): Cypress.Chainable;
  getProductTableProcessing(): Cypress.Chainable;
  getProductTableInfo(): Cypress.Chainable;
  getSelectProductButtons(): Cypress.Chainable;
  getOwningProductField(): Cypress.Chainable;
  getAssignProductsTab(): Cypress.Chainable;
  getRelationTypeTab(): Cypress.Chainable;
  getRuleFieldSelect(ruleIndex: number): Cypress.Chainable;
  getRuleFieldOption(ruleIndex: number, value: string): Cypress.Chainable;
  getRuleOperatorSelect(ruleIndex: number): Cypress.Chainable;
  getRuleValueInput(ruleIndex: number): Cypress.Chainable;
  getSaveButton(): Cypress.Chainable;
  getEditRelationHeading(key: string): string;
}
