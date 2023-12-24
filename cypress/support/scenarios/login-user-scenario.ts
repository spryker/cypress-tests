import { Page as LoginPage } from '../pages/backoffice/login/page';
import { inject, injectable } from 'inversify';
import { autoProvide } from '../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class LoginUserScenario {
  constructor(@inject(LoginPage) private loginPage: LoginPage) {}

  execute = (user: User): void => {
    this.loginPage.login(user);
  };
}
