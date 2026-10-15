import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ClientCreateRepository {
  getClientIdentifierInput = (): Cypress.Chainable => cy.get('#client_registration_client_identifier');
  getNameInput = (): Cypress.Chainable => cy.get('#client_registration_name');
  getRedirectUrisInput = (): Cypress.Chainable => cy.get('#client_registration_redirect_uris');
  getScopeCheckbox = (scope: string): Cypress.Chainable =>
    cy.get(`input[name="client_registration[scopes][]"][value="${scope}"]`);
  getSubmitButton = (): Cypress.Chainable => cy.get('form[name="client_registration"] input[type="submit"]');
}
