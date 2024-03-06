import { TYPES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { YvesPage } from '../yves-page';
import { LoginRepository } from './login-repository';

@injectable()
@autoWired
export class LoginPage extends YvesPage {
  protected PAGE_URL: string = '/login';

  constructor(@inject(TYPES.LoginRepository) private repository: LoginRepository) {
    super();
  }

  public login = (email: string, password: string): void => {
    this.repository.getLoginEmailInput().clear().type(email);
    this.repository.getLoginPasswordInput().clear().type(password);

    this.repository.getLoginForm().submit();
  };

  public getFailedAuthenticationText = (): string => {
    return this.repository.getFailedAuthenticationText();
  };
}
