import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { MultiFactorAuthPage } from '../../pages/backoffice';

@injectable()
@autoWired
export class UserMfaActivationScenario {
  @inject(MultiFactorAuthPage) private mfaPage: MultiFactorAuthPage;

  execute(email: string): void {
    let mfaCode: string;

    this.mfaPage.visit();
    this.mfaPage.activateMfa('Email');
    this.mfaPage.waitForVerificationPopup();

    cy.getUserMultiFactorAuthCode(email, 'email')
      .then((code) => {
        mfaCode = code;
        this.mfaPage.verifyCode(code);
        this.mfaPage.waitForActivationSuccessMessage();
      })
      .then(() => {
        cy.cleanUpUserMultiFactorAuthCode(mfaCode);
      });
  }

  deactivate(email: string): void {
    let mfaCode: string;

    this.mfaPage.visit();
    this.mfaPage.deactivateMfa('Email');
    this.mfaPage.waitForVerificationPopup();

    cy.getUserMultiFactorAuthCode(email, 'email')
      .then((code) => {
        mfaCode = code;
        this.mfaPage.verifyCode(code);
        this.mfaPage.waitForDeactivationSuccessMessage();
      })
      .then(() => {
        cy.cleanUpUserMultiFactorAuthCode(mfaCode);
      });
  }
}
