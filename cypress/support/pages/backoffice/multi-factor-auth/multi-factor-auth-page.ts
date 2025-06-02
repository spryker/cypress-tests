import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MultiFactorAuthRepository } from './multi-factor-auth-repository';
import { BackofficePage } from '@pages/backoffice';

@injectable()
@autoWired
export class MultiFactorAuthPage extends BackofficePage {
  @inject(REPOSITORIES.UserMultiFactorAuthRepository) private repository: MultiFactorAuthRepository;

  protected PAGE_URL = '/multi-factor-auth/user-management/set-up';

  verifyCode(code: string): void {
    this.repository.getVerificationCodeInput().type(code);
    this.repository.getVerifyButton().click();
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

  waitForInvalidCodeMessage(): void {
    cy.contains(this.repository.getInvalidCodeMessage()).should('be.visible');
  }
}
