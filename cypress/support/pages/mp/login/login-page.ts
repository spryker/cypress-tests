import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { MpPage } from '../mp-page';
import { LoginRepository } from './login-repository';

@injectable()
@autoWired
export class LoginPage extends MpPage {
  protected PAGE_URL: string = '/security-merchant-portal-gui/login';

  constructor(@inject(LoginRepository) private repository: LoginRepository) {
    super();
  }

  public login = (username: string, password: string): void => {
    cy.visitMerchantPortal(this.PAGE_URL);
    this.repository.getEmailInput().clear().type(username);
    this.repository.getPasswordInput().clear().type(password);

    this.repository.getSubmitButton().click();
  };

  public getFailedAuthenticationText = (): string => {
    return this.repository.getFailedAuthenticationText();
  };
}
