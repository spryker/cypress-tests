import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired
export class SspModelUpdateRepository {
  getCodeInput = (): Cypress.Chainable => cy.get('input[name="modelForm[code]"]');
  getSubmitButton = (): Cypress.Chainable => cy.get('form[name="modelForm"] button[data-qa="submit"]');
  getSuccessMessageContainer = (): Cypress.Chainable => cy.get('[data-qa*="success-message"]');
  getSuccessMessage = (): string => 'Model has been successfully updated';
}
