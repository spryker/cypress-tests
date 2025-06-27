import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProfileRepository {
  getPhoneNumberInput = (): Cypress.Chainable =>
    cy.get('#merchantProfile_businessInfoMerchantProfile_contact_person_phone');

  getProfileForm = (): Cypress.Chainable => cy.get('form[name=merchantProfile]');

  getChangePasswordButton = (): Cypress.Chainable => cy.get('web-spy-button-action[action*="change-password"] button');

  getDefaultPasswordInput = (): Cypress.Chainable =>
    cy.get('input[name="security-merchant-portal-gui_change-password[current_password]"]');

  getNewPasswordInput = (): Cypress.Chainable =>
    cy.get('input[name="security-merchant-portal-gui_change-password[new_password][first]"]');

  getConfirmPasswordInput = (): Cypress.Chainable =>
    cy.get('input[name="security-merchant-portal-gui_change-password[new_password][second]"]');

  getSubmitButton = (): Cypress.Chainable => cy.get('button[type="submit"]');

  getPasswordChangedMessage = (): string => 'Success! The Password is updated.';
}
