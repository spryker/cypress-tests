import { Customer } from '../index';
import { Page as LoginPage } from '../pages/yves/login/page';

export class LoginCustomerScenario {
  static execute = (customer: Customer): void => {
    new LoginPage().login(customer);
  };
}
