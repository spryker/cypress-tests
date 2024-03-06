import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BackofficePage } from '../backoffice-page';
import { LoginRepository } from './login-repository';

@injectable()
@autoWired
export class LoginPage extends BackofficePage {
  @inject(LoginRepository) private repository: LoginRepository;

  protected PAGE_URL = '/security-gui/login';

  login = (username: string, password: string): void => {
    this.repository.getEmailInput().clear().type(username);
    this.repository.getPasswordInput().clear().type(password);

    this.repository.getSubmitButton().click();
  };
}
