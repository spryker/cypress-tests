import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CustomerProfileRepository } from './customer-profile-repository';

@injectable()
@autoWired
export class CustomerProfilePage extends YvesPage {
  @inject(REPOSITORIES.CustomerProfileRepository) private repository: CustomerProfileRepository;

  protected PAGE_URL = '/customer/profile';

  changePassword(currentPassword: string, newPassword: string, confirmPassword: string = newPassword): void {
    this.repository.getCurrentPasswordInput().type(currentPassword);
    this.repository.getNewPasswordInput().type(newPassword);
    this.repository.getConfirmPasswordInput().type(confirmPassword);
    this.repository.getSubmitButton().click();
  }

  getPasswordChangedMessage(): Cypress.Chainable {
    return cy.contains(this.repository.getPasswordChangedMessage());
  }

  updateProfileData(salutation: string, firstName: string, lastName: string): void {
    this.repository.getSalutationSelect().select(salutation, { force: true });
    this.repository.getFirstNameInput().clear().type(firstName);
    this.repository.getLastNameInput().clear().type(lastName);
    this.repository.getProfileSubmitButton().click();
  }

  updateEmail(email: string): void {
    this.repository.getEmailInput().clear().type(email);
    this.repository.getProfileSubmitButton().click();
  }

  getProfileSavedMessage(): Cypress.Chainable {
    return cy.contains(this.repository.getProfileSavedMessage());
  }

  getEmailInUseError(): Cypress.Chainable {
    return cy.contains(this.repository.getEmailInUseErrorMessage());
  }

  getPasswordsDoNotMatchError(): Cypress.Chainable {
    return cy.contains(this.repository.getPasswordsDoNotMatchMessage());
  }

  getSalutationSelect(): Cypress.Chainable {
    return this.repository.getSalutationSelect();
  }

  getFirstNameInput(): Cypress.Chainable {
    return this.repository.getFirstNameInput();
  }

  getLastNameInput(): Cypress.Chainable {
    return this.repository.getLastNameInput();
  }

  getEmailInput(): Cypress.Chainable {
    return this.repository.getEmailInput();
  }
}
