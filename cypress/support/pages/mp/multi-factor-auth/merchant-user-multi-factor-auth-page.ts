import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MerchantUserMultiFactorAuthRepository } from './merchant-user-multi-factor-auth-repository';
import { MultiFactorAuthPageInterface } from './multi-factor-auth-page-interface';
import { MpPage } from '@pages/mp';

@injectable()
@autoWired
export class MerchantUserMultiFactorAuthPage extends MpPage implements MultiFactorAuthPageInterface {
  @inject(MerchantUserMultiFactorAuthRepository) private repository: MerchantUserMultiFactorAuthRepository;

  protected PAGE_URL = '/multi-factor-auth-merchant-portal/user-management/set-up';

  submitCode(code: string): void {
    cy.intercept('POST', '**/send-code').as('sendCode');
    this.repository.getVerificationCodeInput().type(code);
    this.repository.getVerifyButton().click();
    cy.wait('@sendCode', { responseTimeout: 30000 });
  }

  verifyCode(code: string): void {
    this.submitCode(code);
  }

  activateMfa(type: string): void {
    this.repository.getMfaTypeSection(type).click();
  }

  deactivateMfa(type: string): void {
    this.repository.getMfaTypeSection(type).click();
  }

  getVerificationPopup(): Cypress.Chainable {
    return this.repository.getVerificationPopup();
  }

  getActivationSuccessMessage(): Cypress.Chainable {
    return cy.contains(this.repository.getActivationSuccessMessage());
  }

  getDeactivationSuccessMessage(): Cypress.Chainable {
    return cy.contains(this.repository.getDeactivationSuccessMessage());
  }

  getInvalidCodeMessage(): Cypress.Chainable {
    return cy.contains(this.repository.getInvalidCodeMessage());
  }
}
