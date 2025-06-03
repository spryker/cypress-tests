import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { AgentMultiFactorAuthPage } from '../../pages/yves/multi-factor-auth/agent/agent-multi-factor-auth-page';

@injectable()
@autoWired
export class AgentMfaActivationScenario {
  @inject(AgentMultiFactorAuthPage) private agentMfaPage: AgentMultiFactorAuthPage;

  execute(username: string): void {
    let mfaCode: string;

    this.agentMfaPage.visit();
    this.agentMfaPage.activateMfa('Email');
    this.agentMfaPage.waitForVerificationPopup();

    cy.getUserMultiFactorAuthCode(username, 'email')
      .then((code) => {
        mfaCode = code;
        this.agentMfaPage.verifyCode(code);
        this.agentMfaPage.waitForActivationSuccessMessage();
      })
      .then(() => {
        cy.cleanUpUserMultiFactorAuthCode(mfaCode);
      });
  }

  deactivate(username: string): void {
    let mfaCode: string;

    this.agentMfaPage.visit();
    this.agentMfaPage.deactivateMfa('Email');
    this.agentMfaPage.waitForVerificationPopup();

    cy.getUserMultiFactorAuthCode(username, 'email')
      .then((code) => {
        mfaCode = code;
        this.agentMfaPage.verifyCode(code);
        this.agentMfaPage.waitForDeactivationSuccessMessage();
      })
      .then(() => {
        cy.cleanUpUserMultiFactorAuthCode(mfaCode);
      });
  }
}
