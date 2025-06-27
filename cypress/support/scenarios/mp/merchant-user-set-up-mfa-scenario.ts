import { injectable } from 'inversify';
import { autoWired } from '@utils';
import { MultiFactorAuthPageInterface } from '../../pages/mp/multi-factor-auth/multi-factor-auth-page-interface';

@injectable()
@autoWired
export class MerchantUserSetUpMfaScenario {
  constructor(private readonly mfaPage: MultiFactorAuthPageInterface) {}

  executeActivation(email: string): void {
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

  executeDeactivation(email: string): void {
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
