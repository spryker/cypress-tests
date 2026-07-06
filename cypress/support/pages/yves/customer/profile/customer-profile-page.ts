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

  waitForPasswordChangedMessage(): void {
    cy.contains(this.repository.getPasswordChangedMessage()).should('be.visible');
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

  assertProfileSaved(): void {
    cy.contains(this.repository.getProfileSavedMessage()).should('be.visible');
  }

  assertEmailInUseError(): void {
    cy.contains(this.repository.getEmailInUseErrorMessage()).should('be.visible');
  }

  assertPasswordsDoNotMatchError(): void {
    cy.contains(this.repository.getPasswordsDoNotMatchMessage()).should('be.visible');
  }
}
