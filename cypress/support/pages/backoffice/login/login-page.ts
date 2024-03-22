import { autoWired } from '@utils';
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
}

interface LoginParams {
  username: string;
  password: string;
}
