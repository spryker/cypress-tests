import { inject, injectable } from 'inversify';
import { TYPES } from '../../../utils/inversify/types';
import 'reflect-metadata';
import { LoginRepository } from './login-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';
import { YvesPage } from '../yves-page';

@injectable()
@autoWired
export class LoginPage extends YvesPage {
  protected PAGE_URL: string = '/login';

  constructor(@inject(TYPES.YvesLoginRepository) private repository: LoginRepository) {
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
