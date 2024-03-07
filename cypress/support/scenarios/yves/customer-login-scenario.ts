import { LoginPage } from '@pages/yves';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

interface CustomerLoginExecuteParams {
  email: string;
  password: string;
}

@injectable()
@autoWired
export class CustomerLoginScenario {
  @inject(LoginPage) private loginPage: LoginPage;

  execute = (params: CustomerLoginExecuteParams): void => {
    const { email, password } = params;

    cy.session([email, password], () => {
      this.loginPage.visit();
      this.loginPage.login(email, password);
    });
  };
}
