import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { MultiFactorAuthRepository } from './multi-factor-auth-repository';

@injectable()
@autoWired
export class MultiFactorAuthPage extends YvesPage {
  @inject(REPOSITORIES.MultiFactorAuthRepository) private repository: MultiFactorAuthRepository;

  protected PAGE_URL = '/multi-factor-auth/set';

  verifyCode(code: string): void {
    this.repository.getVerificationCodeInput().type(code);
    this.repository.getVerifyButton().click();
  }

  activateMfa(type: string): void {
    this.repository.getMfaTypeSection(type).within(() => {
      this.repository.getActivateForm().within(() => {
        this.repository.getSubmitButton().click();
      });
    });
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

  deactivateMfa(type: string): void {
    this.repository.getMfaTypeSection(type).within(() => {
      this.repository.getDeactivateForm().within(() => {
        this.repository.getSubmitButton().click();
      });
    });
  }
}
