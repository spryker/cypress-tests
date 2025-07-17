import { injectable } from 'inversify';
import { MultiFactorAuthRepository } from '../multi-factor-auth-repository';

@injectable()
export class B2cMpMultiFactorAuthRepository implements MultiFactorAuthRepository {
  getVerificationCodeInput(): Cypress.Chainable {
    return cy.get('input[name="codeValidationForm[authentication_code]"]');
  }

  getVerifyButton(): Cypress.Chainable {
    return cy.get('form[name="codeValidationForm"] button[type="submit"]');
  }

  getVerificationPopup(): Cypress.Chainable {
    return cy.get('div[data-qa*="component multi-factor-authentication-content"]', { timeout: 10000 });
  }

  getMfaTypeSection(type: string): Cypress.Chainable {
    return cy.get(`div[data-qa="mfa-type-section"]:contains("${type}")`);
  }

  getActivateForm(): Cypress.Chainable {
    return cy.get('form[name^="activateForm"]').first();
  }

  getDeactivateForm(): Cypress.Chainable {
    return cy.get('form[name^="deactivateForm"]').first();
  }

  getSubmitButton(): Cypress.Chainable {
    return cy.get('button[type="submit"]');
  }

  getActivationSuccessMessage(): string {
    return 'The multi-factor authentication has been activated';
  }

  getDeactivationSuccessMessage(): string {
    return 'The multi-factor authentication has been deactivated';
  }

  getInvalidCodeMessage(): string {
    return 'Invalid multi-factor authentication code';
  }
}
