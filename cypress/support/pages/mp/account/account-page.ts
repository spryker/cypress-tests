import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '@pages/mp';
import { AccountRepository } from './account-repository';

@injectable()
@autoWired
export class AccountPage extends MpPage {
  @inject(AccountRepository) private repository: AccountRepository;

  protected PAGE_URL = '/user-merchant-portal-gui/my-account';

  // The portal renders this page from its Angular bundle after the server response, and the form
  // fields appear only once that has parsed. There is no request to wait on, so this settles first.
  visitAccount = (): void => {
    this.visit();

    // eslint-disable-next-line cypress/no-unnecessary-waiting, spryker-cypress/no-numeric-wait
    cy.wait(6000);
  };

  updatePersonalDetails = (params: UpdatePersonalDetailsParams): void => {
    this.repository.getFirstNameInput().clear().type(params.firstName);
    this.repository.getLastNameInput().clear().type(params.lastName);
    this.repository.getSaveButton().click();
  };

  getFirstNameValue = (): Cypress.Chainable => {
    return this.repository.getFirstNameInput();
  };

  openChangePasswordForm = (): void => {
    this.repository.getChangePasswordButton().click();
  };

  changePassword(defaultPassword: string, newPassword: string): void {
    this.repository.getDefaultPasswordInput().type(defaultPassword);
    this.repository.getNewPasswordInput().type(newPassword);
    this.repository.getConfirmPasswordInput().type(newPassword);
    this.repository.getSubmitButton().click();
  }

  getPasswordChangedMessage(): Cypress.Chainable {
    return cy.contains(this.repository.getPasswordChangedMessage());
  }
}

interface UpdatePersonalDetailsParams {
  firstName: string;
  lastName: string;
}
