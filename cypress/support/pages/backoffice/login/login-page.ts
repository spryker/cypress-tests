import { LoginRepository } from './login-repository';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoWired } from '../../../utils/inversify/auto-wired';
import { BackofficePage } from '../backoffice-page';

@injectable()
@autoWired
export class LoginPage extends BackofficePage {
  protected PAGE_URL: string = '/security-gui/login';

  constructor(@inject(LoginRepository) private repository: LoginRepository) {
    super();
  }

  public login = (username: string, password: string): void => {
    this.repository.getEmailInput().clear().type(username);
    this.repository.getPasswordInput().clear().type(password);

    this.repository.getSubmitButton().click();
  };
}
