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

        cy.getMultiFactorAuthCode(email, 'email').then((code) => {
            mfaCode = code;
            this.mfaPage.verifyCode(code);
        }).then(() => {
            cy.wait(1000); 
        }).then(() => {
            cy.cleanUpCode(mfaCode);
        }).then(() => {
            this.mfaPage.verifyMfaActivated('Email');
        });
    }

    deactivate(email: string): void {
        let mfaCode: string;

        this.mfaPage.visit();
        this.mfaPage.deactivateMfa('Email');
        this.mfaPage.waitForVerificationPopup();

        cy.getMultiFactorAuthCode(email, 'email').then((code) => {
            mfaCode = code;
            this.mfaPage.verifyCode(code);
        }).then(() => {
            cy.wait(1000); 
            cy.reload(); 
        }).then(() => {
            cy.cleanUpCode(mfaCode);
        }).then(() => {
            this.mfaPage.verifyMfaDeactivated('Email');
        });
    }
}
