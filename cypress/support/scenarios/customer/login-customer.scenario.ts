import { LoginPage } from '../../pages/yves/login/login.page';
import { Customer } from '../../index';

export class LoginCustomerScenario {
  static execute = (customer: Customer): void => {
    const loginPage = new LoginPage();

    loginPage.login(customer);
  };
}
