import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MultiFactorAuthRepository } from './multi-factor-auth-repository';
import { BackofficePage } from '@pages/backoffice';

@injectable()
@autoWired
export class MultiFactorAuthPage extends BackofficePage {
  @inject(REPOSITORIES.UserMultiFactorAuthRepository) private repository: MultiFactorAuthRepository;

  protected PAGE_URL = '/multi-factor-auth/user-management/set-up';

  verifyCode(code: string): void {
    this.repository.getVerificationCodeInput().type(code);
    this.repository.getVerifyButton().click();
  }

  activateMfa(type: string): void {
    this.repository.getMfaTypeSection(type).click();
  }

  deactivateMfa(type: string): void {
    this.repository.getMfaTypeSection(type).click();
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
}
