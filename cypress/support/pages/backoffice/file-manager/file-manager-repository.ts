export interface FileManagerRepository {
  getDirectoryNameInput(): Cypress.Chainable;
  getDirectoryNameErrorBlock(): Cypress.Chainable;
  getLocalizedTitleInputs(): Cypress.Chainable;
  getLocalizedTitleInputById(id: string): Cypress.Chainable;
  getLocalizedTitleIboxTitleByInputId(id: string): Cypress.Chainable;
  getLocalizedTitleErrorBlockById(id: string): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
  getBlankValueError(): string;
  getMaxLengthError(): string;
  getSqlQueryError(): string;
  getSuccessMessage(): string;
}
