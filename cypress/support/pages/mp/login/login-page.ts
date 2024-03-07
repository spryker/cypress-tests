import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '../mp-page';
import { LoginRepository } from './login-repository';

@injectable()
@autoWired
export class LoginPage extends MpPage {
  @inject(LoginRepository) private repository: LoginRepository;

  protected PAGE_URL = '/security-merchant-portal-gui/login';

  login = (username: string, password: string): void => {
    cy.visitMerchantPortal(this.PAGE_URL);
    this.repository.getEmailInput().clear().type(username);
    this.repository.getPasswordInput().clear().type(password);

    this.repository.getSubmitButton().click();
  };

  getFailedAuthenticationText = (): string => {
    return this.repository.getFailedAuthenticationText();
  };
}
