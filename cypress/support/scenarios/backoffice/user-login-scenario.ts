import { LoginPage } from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

interface UserLoginExecuteParams {
  username: string;
  password: string;
}

@injectable()
@autoWired
export class UserLoginScenario {
  @inject(LoginPage) private loginPage: LoginPage;

  execute = (params: UserLoginExecuteParams): void => {
    const { username, password } = params;

    cy.session([username, password], () => {
      this.loginPage.visit();
      this.loginPage.login(username, password);
    });
  };
}
