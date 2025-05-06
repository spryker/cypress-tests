import { injectable } from 'inversify';
import { MultiFactorAuthRepository } from '../multi-factor-auth-repository';

@injectable()
export class B2cUserMultiFactorAuthRepository implements MultiFactorAuthRepository {
  getVerificationCodeInput(): Cypress.Chainable {
    return cy.get('input[name="codeValidationForm[authentication_code]"]');
  }

  getVerifyButton(): Cypress.Chainable {
    return cy.get('form[name="codeValidationForm"] input[type="submit"]');
  }

  getVerificationPopup(): Cypress.Chainable {
    return cy.get(`div[data-qa="multi-factor-authentication-modal"]`, { timeout: 20000 });
  }

  getMfaTypeSection(type: string): Cypress.Chainable {
    return cy
      .get('tr[data-qa="mfa-type-section"]')
      .filter((_, el) => {
        return Cypress.$(el).find('td').first().text().trim() === type;
      })
      .find('button');
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
