import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../utils/inversify/types';
import 'reflect-metadata';
import { LoginRepository } from './login-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class LoginPage extends AbstractPage {
  public PAGE_URL: string = '/login';

  private DEFAULT_SALUTATION: string = 'Mr';
  private DEFAULT_PASSWORD_PREFIX: string = 'Change123@_';

  constructor(@inject(TYPES.YvesLoginRepository) private repository: LoginRepository) {
    super();
  }

  public login = (email: string, password: string): void => {
    cy.session([email, password], () => {
      cy.visit(this.PAGE_URL);
      this.repository.getLoginEmailInput().clear().type(email);
      this.repository.getLoginPasswordInput().clear().type(password);

      this.repository.getLoginForm().submit();
    });
  };

  public getFailedAuthenticationText = (): string => {
    return this.repository.getFailedAuthenticationText();
  };
}
