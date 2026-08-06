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

    this.mfaPage.getVerificationPopup().should('be.visible');

    cy.getUserMultiFactorAuthCode(email, 'email')
      .then((code) => {
        mfaCode = code;

        cy.intercept('POST', '**/*user-management/activate*').as('activateForm');
        this.mfaPage.verifyCode(code);
        this.mfaPage.getVerificationPopup().should('not.exist');
      })
      .then(() => {
        cy.wait('@activateForm');
        this.mfaPage.getActivationSuccessMessage().should('be.visible');
        cy.cleanUpUserMultiFactorAuthCode(mfaCode);
      });
  }

  executeDeactivation(email: string): void {
    let mfaCode: string;

    this.mfaPage.visit();

    cy.intercept('POST', '**/get-enabled-types*').as('getEnabledTypes');
    this.mfaPage.deactivateMfa('Email');
    cy.wait('@getEnabledTypes');

    this.mfaPage.getVerificationPopup().should('be.visible');

    cy.getUserMultiFactorAuthCode(email, 'email')
      .then((code) => {
        mfaCode = code;

        cy.intercept('POST', '**/*user-management/deactivate*').as('deactivateForm');
        this.mfaPage.verifyCode(code);
        this.mfaPage.getVerificationPopup().should('not.exist');
      })
      .then(() => {
        cy.wait('@deactivateForm');
        this.mfaPage.getDeactivationSuccessMessage().should('be.visible');
        cy.cleanUpUserMultiFactorAuthCode(mfaCode);
      });
  }
}
