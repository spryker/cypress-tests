import { inject, injectable } from 'inversify';
import { autoProvide } from '../../utils/inversify/auto-provide';
import { BackofficeLoginPage } from '../../pages/backoffice/login/backoffice-login-page';

@injectable()
@autoProvide
export class BackofficeLoginUserScenario {
  constructor(
    @inject(BackofficeLoginPage) private loginPage: BackofficeLoginPage
  ) {}

  execute = (user: User): void => {
    this.loginPage.login(user);
  };
}
