import { autoWired, CAPTCHA_VERIFICATION_TIMEOUT, tamperAltchaPayload } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '@pages/mp';
import { AgentLoginRepository } from './agent-login-repository';

@injectable()
@autoWired
export class AgentLoginPage extends MpPage {
  @inject(AgentLoginRepository) private repository: AgentLoginRepository;

  protected PAGE_URL = '/agent-security-merchant-portal-gui/login';

  login = (params: LoginParams): void => {
    this.repository.getEmailInput().clear().type(params.username);
    this.repository.getPasswordInput().clear().type(params.password);

    cy.resetProxyCookieJar();
    this.repository.getSubmitButton().click();
  };

  getFailedAuthenticationText = (): string => {
    return this.repository.getFailedAuthenticationText();
  };

  getCaptchaWidget = (): Cypress.Chainable => this.repository.getCaptchaWidget();

  solveCaptcha = (): void => {
    this.repository.getCaptchaCheckboxLabel().click();
    this.waitForCaptchaVerified();
  };

  waitForCaptchaVerified = (): void => {
    this.repository
      .getCaptchaWidget()
      .find(this.repository.getCaptchaVerifiedStateSelector(), { timeout: CAPTCHA_VERIFICATION_TIMEOUT });
  };

  tamperCaptchaPayload = (): void => {
    this.repository
      .getCaptchaPayloadInput()
      .then(($payloadInput: JQuery<HTMLInputElement>) =>
        $payloadInput.val(tamperAltchaPayload(String($payloadInput.val())))
      );
  };

  getCaptchaRequiredText = (): string => this.repository.getCaptchaRequiredText();

  getCaptchaInvalidText = (): string => this.repository.getCaptchaInvalidText();

  getAccountBlockedText = (): string => this.repository.getAccountBlockedText();
}

interface LoginParams {
  username: string;
  password: string;
}
