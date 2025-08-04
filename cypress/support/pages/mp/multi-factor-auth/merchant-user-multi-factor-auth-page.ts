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

  verifyCode(code: string): void {
    cy.intercept('POST', '**/send-code').as('sendCode');
    this.repository.getVerificationCodeInput().type(code);
    this.repository.getVerifyButton().click();
    cy.wait('@sendCode');
  }

  activateMfa(type: string): void {
    this.repository.getMfaTypeSection(type).click();
  }

  deactivateMfa(type: string): void {
    this.repository.getMfaTypeSection(type).click();
  }

  waitForVerificationPopup(): void {
    this.repository.getVerificationPopup().should('be.visible');
  }

  waitForActivationSuccessMessage(): void {
    cy.contains(this.repository.getActivationSuccessMessage()).should('be.visible');
  }

  waitForDeactivationSuccessMessage(): void {
    cy.contains(this.repository.getDeactivationSuccessMessage()).should('be.visible');
  }
}
