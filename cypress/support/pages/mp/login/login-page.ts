import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '@pages/mp';
import { LoginRepository } from './login-repository';

@injectable()
@autoWired
export class LoginPage extends MpPage {
  @inject(LoginRepository) private repository: LoginRepository;

  protected PAGE_URL = '/security-merchant-portal-gui/login';

  login = (params: LoginParams): void => {
    this.repository.getEmailInput().clear().type(params.username);
    this.repository.getPasswordInput().clear().type(params.password);

    this.repository.getSubmitButton().click();
  };

  getFailedAuthenticationText = (): string => {
    return this.repository.getFailedAuthenticationText();
  };
}

interface LoginParams {
  username: string;
  password: string;
}
