import { injectable } from 'inversify';
import { CustomerProfileRepository } from '../customer-profile-repository';

@injectable()
export class B2cMpCustomerProfileRepository implements CustomerProfileRepository {
  getCurrentPasswordInput(): Cypress.Chainable {
    return cy.get('input[name="passwordForm[password]"]');
  }

  getNewPasswordInput(): Cypress.Chainable {
    return cy.get('input[name="passwordForm[new_password][password]"]');
  }

  getConfirmPasswordInput(): Cypress.Chainable {
    return cy.get('input[name="passwordForm[new_password][confirm]"]');
  }

  getSubmitButton(): Cypress.Chainable {
    return cy.get('form[name="passwordForm"] button[type="submit"]');
  }

  getPasswordChangedMessage(): string {
    return 'Password change successful';
  }
  getSalutationSelect(): Cypress.Chainable {
    return cy.get('select[name="profileForm[salutation]"]');
  }

  getFirstNameInput(): Cypress.Chainable {
    return cy.get('input[name="profileForm[first_name]"]');
  }

  getLastNameInput(): Cypress.Chainable {
    return cy.get('input[name="profileForm[last_name]"]');
  }

  getEmailInput(): Cypress.Chainable {
    return cy.get('input[name="profileForm[email]"]');
  }

  getProfileSubmitButton(): Cypress.Chainable {
    return cy.get('form[name="profileForm"] button[type="submit"]');
  }

  getProfileSavedMessage(): string {
    return 'Profile was successfully saved';
  }

  getEmailInUseErrorMessage(): string {
    return 'If this E-mail address is already in use, you will receive a password reset link. Otherwise, you must first validate your E-mail address to finish registration. Please check your E-mail.';
  }

  getPasswordsDoNotMatchMessage(): string {
    return "Passwords don't match";
  }
}
