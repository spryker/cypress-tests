import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '../yves-page';
import { LoginRepository } from './login-repository';

@injectable()
@autoWired
export class LoginPage extends YvesPage {
  @inject(REPOSITORIES.LoginRepository) private repository: LoginRepository;

  protected PAGE_URL = '/login';

  login = (email: string, password: string): void => {
    this.repository.getLoginEmailInput().clear().type(email);
    this.repository.getLoginPasswordInput().clear().type(password);

    this.repository.getLoginForm().submit();
  };

  getFailedAuthenticationText = (): string => {
    return this.repository.getFailedAuthenticationText();
  };
}
