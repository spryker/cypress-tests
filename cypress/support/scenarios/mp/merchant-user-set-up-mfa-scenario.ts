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

    cy.intercept('POST', '**/get-enabled-types*').as('getEnabledTypes');
    this.mfaPage.activateMfa('Email');
    cy.wait('@getEnabledTypes');

    this.mfaPage.waitForVerificationPopup();

    cy.getUserMultiFactorAuthCode(email, 'email')
      .then((code) => {
        mfaCode = code;

        this.mfaPage.verifyCode(code);
      })
      .then(() => {
        this.mfaPage.waitForActivationSuccessMessage();
        cy.cleanUpUserMultiFactorAuthCode(mfaCode);
      });
  }

  executeDeactivation(email: string): void {
    let mfaCode: string;

    this.mfaPage.visit();

    cy.intercept('POST', '**/get-enabled-types*').as('getEnabledTypes');
    this.mfaPage.deactivateMfa('Email');
    cy.wait('@getEnabledTypes');

    this.mfaPage.waitForVerificationPopup();

    cy.getUserMultiFactorAuthCode(email, 'email')
      .then((code) => {
        mfaCode = code;

        this.mfaPage.verifyCode(code);
      })
      .then(() => {
        this.mfaPage.waitForDeactivationSuccessMessage();
        cy.cleanUpUserMultiFactorAuthCode(mfaCode);
      });
  }
}
