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

  getVerificationPopup(): Cypress.Chainable {
    return this.repository.getVerificationPopup();
  }

  getActivationSuccessMessage(): Cypress.Chainable {
    return cy.contains(this.repository.getActivationSuccessMessage(), { timeout: 10000 });
  }

  getDeactivationSuccessMessage(): Cypress.Chainable {
    return cy.contains(this.repository.getDeactivationSuccessMessage(), { timeout: 10000 });
  }

  getInvalidCodeMessage(): Cypress.Chainable {
    return cy.contains(this.repository.getInvalidCodeMessage());
  }

  deactivateMfa(type: string): void {
    this.repository.getMfaTypeSection(type).within(() => {
      this.repository.getDeactivateForm().within(() => {
        this.repository.getSubmitButton().click();
      });
    });
  }
}
