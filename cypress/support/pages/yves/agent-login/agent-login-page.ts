import { CAPTCHA_VERIFICATION_TIMEOUT, REPOSITORIES, autoWired, tamperAltchaPayload } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { AgentLoginRepository } from './agent-login-repository';

@injectable()
@autoWired
export class AgentLoginPage extends YvesPage {
  @inject(REPOSITORIES.AgentLoginRepository) private repository: AgentLoginRepository;

  protected PAGE_URL = '/agent/login';

  login = (params: LoginParams): void => {
    this.repository.getLoginEmailInput().clear().type(params.username);
    this.repository.getLoginPasswordInput().clear().type(params.password);

    cy.resetProxyCookieJar();
    this.repository.getLoginForm().submit();
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
