import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantCreateRepository {
  getNameInput = (): Cypress.Chainable => cy.get('#merchant_name');
  getReferenceInput = (): Cypress.Chainable => cy.get('#merchant_merchant_reference');
  getEmailInput = (): Cypress.Chainable => cy.get('#merchant_email');
  getActiveCheckbox = (): Cypress.Chainable => cy.get('#merchant_is_active');
  getDEUrlInput = (): Cypress.Chainable => cy.get('#merchant_urlCollection_0_url');
  getENUrlInput = (): Cypress.Chainable => cy.get('#merchant_urlCollection_1_url');
  getSaveButton = (): Cypress.Chainable => cy.get('form[name=merchant]').find('[type="submit"]');
}
