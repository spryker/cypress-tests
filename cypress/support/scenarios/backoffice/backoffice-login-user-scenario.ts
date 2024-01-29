import { inject, injectable } from 'inversify';
import { BackofficeLoginPage } from '../../pages/backoffice/login/backoffice-login-page';
import { autoWired } from '../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class BackofficeLoginUserScenario {
  constructor(@inject(BackofficeLoginPage) private loginPage: BackofficeLoginPage) {}

  public execute = (user: User): void => {
    cy.visitBackoffice(this.loginPage.PAGE_URL);
    this.loginPage.login(user);
  };
}
