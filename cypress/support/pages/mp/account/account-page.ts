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

  // Saving ends the portal session, so the response has to be in before anything signs in again —
  // otherwise the sign-in races the session that the save is still tearing down.
  updatePersonalDetails = (params: UpdatePersonalDetailsParams): void => {
    cy.intercept('POST', '**/user-merchant-portal-gui/my-account**').as('merchantAccountSaved');

    this.repository.getFirstNameInput().clear().type(params.firstName);
    this.repository.getLastNameInput().clear().type(params.lastName);
    this.repository.getSaveButton().click();

    cy.wait('@merchantAccountSaved');
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
