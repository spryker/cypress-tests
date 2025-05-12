import { injectable } from 'inversify';
import { CustomerProfileRepository } from '../customer-profile-repository';

@injectable()
export class B2bMpCustomerProfileRepository implements CustomerProfileRepository {
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
}
