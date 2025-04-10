import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { MultiFactorAuthPage } from '../../pages/yves';

@injectable()
@autoWired
export class CustomerMfaActivationScenario {
  @inject(MultiFactorAuthPage) private mfaPage: MultiFactorAuthPage;

  execute(email: string): void {
    let mfaCode: string;

    this.mfaPage.visit();
    this.mfaPage.activateMfa('Email');
    this.mfaPage.waitForVerificationPopup();

    cy.getMultiFactorAuthCode(email, 'email')
      .then((code) => {
        mfaCode = code;
        this.mfaPage.verifyCode(code);
        this.mfaPage.waitForActivationSuccessMessage();
      })
      .then(() => {
        cy.cleanUpMultiFactorAuthCode(mfaCode);
      });
  }

  deactivate(email: string): void {
    let mfaCode: string;

    this.mfaPage.visit();
    this.mfaPage.deactivateMfa('Email');
    this.mfaPage.waitForVerificationPopup();

    cy.getMultiFactorAuthCode(email, 'email')
      .then((code) => {
        mfaCode = code;
        this.mfaPage.verifyCode(code);
        this.mfaPage.waitForDeactivationSuccessMessage();
      })
      .then(() => {
        cy.cleanUpMultiFactorAuthCode(mfaCode);
      });
  }
}
