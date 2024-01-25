import { injectable } from 'inversify';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import 'reflect-metadata';

@injectable()
@autoProvide
export class BackofficeMerchantCreateRepository {
  getNameInput = (): Cypress.Chainable => {
    return cy.get('#merchant_name');
  };

  getReferenceInput = (): Cypress.Chainable => {
    return cy.get('#merchant_merchant_reference');
  };

  getEmailInput = (): Cypress.Chainable => {
    return cy.get('#merchant_email');
  };

  getActiveCheckbox = (): Cypress.Chainable => {
    return cy.get('#merchant_is_active');
  };

  getDEUrlInput = (): Cypress.Chainable => {
    return cy.get('#merchant_urlCollection_0_url');
  };

  getENUrlInput = (): Cypress.Chainable => {
    return cy.get('#merchant_urlCollection_1_url');
  };

  getSaveButton = (): Cypress.Chainable => {
    return cy.get('form[name=merchant]').find('[type="submit"]');
  };
}
