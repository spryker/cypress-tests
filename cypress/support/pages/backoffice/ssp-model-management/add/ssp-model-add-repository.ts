import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired
export class SspModelAddRepository {
  getNameInput = (): Cypress.Chainable => cy.get('input[name="modelForm[name]"]');
  getCodeInput = (): Cypress.Chainable => cy.get('input[name="modelForm[code]"]');
  getImageUploadInput = (): Cypress.Chainable => cy.get('input[name="modelForm[model_image][file]"]');
  getSubmitButton = (): Cypress.Chainable => cy.get('form[name="modelForm"] button[data-qa="submit"]');
  getSuccessMessageContainer = (): Cypress.Chainable => cy.get('[data-qa*="success-message"]');
  getSuccessMessage = (): string => 'Model has been successfully created';
}
