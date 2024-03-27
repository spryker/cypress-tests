import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { LoginRepository } from './login-repository';

@injectable()
@autoWired
export class LoginPage extends YvesPage {
  @inject(REPOSITORIES.LoginRepository) private repository: LoginRepository;

  protected PAGE_URL = '/login';

  login = (params: LoginParams): void => {
    this.repository.getLoginEmailInput().clear().type(params.email);
    this.repository.getLoginPasswordInput().clear().type(params.password);

    this.repository.getLoginForm().submit();
  };

  getFailedAuthenticationText = (): string => {
    return this.repository.getFailedAuthenticationText();
  };
}

interface LoginParams {
  email: string;
  password: string;
}
