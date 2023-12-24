import { Page as LoginPage } from '../pages/yves/login/page';
import { inject, injectable } from 'inversify';
import { autoProvide } from '../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class LoginCustomerScenario {
  constructor(@inject(LoginPage) private loginPage: LoginPage) {}

  execute = (customer: Customer): void => {
    this.loginPage.login(customer);
  };
}
