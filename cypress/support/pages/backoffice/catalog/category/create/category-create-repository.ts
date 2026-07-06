export interface CategoryCreateRepository {
  getKeyInput(): Cypress.Chainable;
  getParentNodeSelect(): Cypress.Chainable;
  getTemplateSelect(): Cypress.Chainable;
  getCollapsedLocalizedAttributeToggle(): Cypress.Chainable;
  getFieldByName(name: string): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
  getBreadcrumb(): Cypress.Chainable;
  getSuccessMessage(): string;
}
