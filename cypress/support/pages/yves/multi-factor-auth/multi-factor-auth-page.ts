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

  verifyMfaActivated(type: string): void {
    this.repository.assertMfaTypeActivated(type);
  }

  waitForVerificationPopup(): void {
    this.repository.getVerificationPopup().should('be.visible');
  }

  deactivateMfa(type: string): void {
    this.repository.getMfaTypeSection(type).within(() => {
      this.repository.getDeactivateForm().within(() => {
        this.repository.getSubmitButton().click();
      });
    });
  }

  verifyMfaDeactivated(type: string): void {
    this.repository.assertMfaTypeDeactivated(type);
  }
}
