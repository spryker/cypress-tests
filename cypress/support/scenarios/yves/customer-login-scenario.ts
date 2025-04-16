import { LoginPage } from '@pages/yves';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class CustomerLoginScenario {
  @inject(LoginPage) private loginPage: LoginPage;

  execute = (params: ExecuteParams): void => {
    if (params.withoutSession) {
      this.loginPage.visit();
      this.loginPage.login(params);

      return;
    }

    cy.session([params.email, params.password], () => {
      this.loginPage.visit();
      this.loginPage.login(params);
    });
  };
}

interface ExecuteParams {
  email: string;
  password: string;
  withoutSession?: boolean;
}
