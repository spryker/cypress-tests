import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantUserMultiFactorAuthRepository {
  // @TO-DO adjust the selector
  getVerificationCodeInput(): Cypress.Chainable {
    return cy.get('input[name="codeValidationForm[authentication_code]"]');
  }

  // @TO-DO adjust the selector
  getVerifyButton(): Cypress.Chainable {
    return cy.get('form[name="codeValidationForm"] input[type="submit"]');
  }

  // @TO-DO adjust the selector
  getVerificationPopup(): Cypress.Chainable {
    return cy.get(`div[data-qa="multi-factor-authentication-modal"]`, { timeout: 20000 });
  }

  getMfaTypeSection(type: string): Cypress.Chainable {
    return cy
      .get('[data-qa="mfa-type-section"] tr')
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
