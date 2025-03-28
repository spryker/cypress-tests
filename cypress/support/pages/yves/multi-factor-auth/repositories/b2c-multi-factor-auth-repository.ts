import { injectable } from 'inversify';
import { MultiFactorAuthRepository } from '../multi-factor-auth-repository';

@injectable()
export class B2cMultiFactorAuthRepository implements MultiFactorAuthRepository {
  private readonly SELECTORS = {
    VERIFICATION_CODE_INPUT: 'input[name="codeValidationForm[authentication_code]"]',
    VERIFY_BUTTON: 'form[name="codeValidationForm"] button[type="submit"]',
    VERIFICATION_POPUP: '.js-multi-factor-authentication-handler__popup-content',
    FORM_BOX: '.form.box',
    ACTIVATE_FORM: 'form[name^="activateForm"]',
    DEACTIVATE_FORM: 'form[name^="deactivateForm"]',
    SUBMIT_BUTTON: 'button[type="submit"]',
  };

  getVerificationCodeInput(): Cypress.Chainable {
    return cy.get(this.SELECTORS.VERIFICATION_CODE_INPUT);
  }

  getVerifyButton(): Cypress.Chainable {
    return cy.get(this.SELECTORS.VERIFY_BUTTON);
  }

  getVerificationPopup(): Cypress.Chainable {
    return cy.get(this.SELECTORS.VERIFICATION_POPUP, { timeout: 15000 });
  }

  getMfaTypeSection(type: string): Cypress.Chainable {
    return cy.contains(this.SELECTORS.FORM_BOX, type);
  }

  getActivateForm(): Cypress.Chainable {
    return cy.get(this.SELECTORS.ACTIVATE_FORM).first();
  }

  getDeactivateForm(): Cypress.Chainable {
    return cy.get(this.SELECTORS.DEACTIVATE_FORM).first();
  }

  getSubmitButton(): Cypress.Chainable {
    return cy.get(this.SELECTORS.SUBMIT_BUTTON);
  }

  assertActivationSuccess(): void {
    cy.contains('The multi-factor authentication has been activated').should('be.visible');
  }

  assertDeactivationSuccess(): void {
    cy.contains('The multi-factor authentication has been deactivated').should('be.visible');
  }
}
