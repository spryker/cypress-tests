import { LoginPage, IndexPage } from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class UserLoginScenario {
  @inject(LoginPage) private loginPage: LoginPage;
  @inject(IndexPage) private indexPage: IndexPage;

  execute = (params: ExecuteParams): void => {
    cy.session([params.username, params.password], () => {
      this.loginPage.visit();
      this.loginPage.login(params);

      this.indexPage.assertLoginFormDoesNotExist();
    });
  };
}

interface ExecuteParams {
  username: string;
  password: string;
}
