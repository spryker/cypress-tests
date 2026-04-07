import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductAttributeVisibilityCreateRepository {
  getKeyInput = (): Cypress.Chainable => cy.get('#attributeForm_key');
  getInputTypeSelect = (): Cypress.Chainable => cy.get('#attributeForm_input_type');
  getAllowInputCheckbox = (): Cypress.Chainable => cy.get('#attributeForm_allow_input');
  getVisibilityTypesSelect = (): Cypress.Chainable => cy.get('#attributeForm_visibility_types');
  getSubmitButton = (): Cypress.Chainable => cy.get('input[type="submit"].safe-submit');
}
