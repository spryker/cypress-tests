import { autoWired, CAPTCHA_VERIFICATION_TIMEOUT, tamperAltchaPayload } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { LoginRepository } from './login-repository';

@injectable()
@autoWired
export class LoginPage extends BackofficePage {
  @inject(LoginRepository) private repository: LoginRepository;

  protected PAGE_URL = '/security-gui/login';

  login = (params: LoginParams): void => {
    this.repository.getEmailInput().clear().type(params.username);
    this.repository.getPasswordInput().clear().type(params.password);

    this.repository.getSubmitButton().click();
  };

  /**
   * Submits the form element directly, the way a script would, so the browser-side "verification required"
   * check of an unsolved CAPTCHA widget does not stop the request from reaching the server.
   */
  loginBypassingFormValidation = (params: LoginParams): void => {
    this.repository.getEmailInput().clear().type(params.username);
    this.repository.getPasswordInput().clear().type(params.password);

    this.repository.getLoginForm().submit();
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

  getFailedAuthenticationText = (): string => this.repository.getFailedAuthenticationText();

  getCaptchaRequiredText = (): string => this.repository.getCaptchaRequiredText();

  getCaptchaInvalidText = (): string => this.repository.getCaptchaInvalidText();

  getAccountBlockedText = (): string => this.repository.getAccountBlockedText();
}

interface LoginParams {
  username: string;
  password: string;
}
