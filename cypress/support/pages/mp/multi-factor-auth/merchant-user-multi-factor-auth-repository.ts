import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantUserMultiFactorAuthRepository {
  getVerificationCodeInput(): Cypress.Chainable {
    return cy.get('input[name="codeValidationForm[authentication_code]"]');
  }

  getVerifyButton(): Cypress.Chainable {
    return cy.get('[data-qa="multi-factor-authentication-modal"] button[type="submit"]');
  }

  getVerificationPopup(): Cypress.Chainable {
    return cy.get('[data-qa="multi-factor-authentication-modal"]', { timeout: 20000 });
  }

  getMfaTypeSection(type: string): Cypress.Chainable {
    return cy
      .get('[data-qa="mfa-type-section"]')
      .find('> div:not(:first-child)')
      .filter((_, el) => {
        return Cypress.$(el).find('> div:first-child').text().trim() === type;
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
