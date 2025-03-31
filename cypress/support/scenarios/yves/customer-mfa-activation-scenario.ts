import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { MultiFactorAuthPage } from '../../pages/yves';

@injectable()
@autoWired
export class CustomerMfaActivationScenario {
  @inject(MultiFactorAuthPage) private mfaPage: MultiFactorAuthPage;

  execute(email: string, activationSuccessMessage: string): void {
    let mfaCode: string;

    this.mfaPage.visit();
    this.mfaPage.activateMfa('Email');
    this.mfaPage.waitForVerificationPopup();

    cy.getMultiFactorAuthCode(email, 'email')
      .then((code) => {
        mfaCode = code;
        this.mfaPage.verifyCode(code);
        this.mfaPage.waitForMessage(activationSuccessMessage);
      })
      .then(() => {
        cy.cleanUpMultiFactorAuthCode(mfaCode);
      });
  }

  deactivate(email: string, deactivationSuccessMessage: string): void {
    let mfaCode: string;

    this.mfaPage.visit();
    this.mfaPage.deactivateMfa('Email');
    this.mfaPage.waitForVerificationPopup();

    cy.getMultiFactorAuthCode(email, 'email')
      .then((code) => {
        mfaCode = code;
        this.mfaPage.verifyCode(code);
        this.mfaPage.waitForMessage(deactivationSuccessMessage);
      })
      .then(() => {
        cy.cleanUpMultiFactorAuthCode(mfaCode);
      });
  }
}
