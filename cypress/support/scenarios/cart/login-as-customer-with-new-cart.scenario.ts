import { MultiCartPage } from '../../pages/yves/multi-cart/multi.cart.page';
import { LoginPage } from '../../pages/yves/login/login.page';
import { Customer } from '../../index';

export class LoginAsCustomerWithNewCartScenario {
  static execute = (customer: Customer): void => {
    const loginPage = new LoginPage();
    const multiCartPage = new MultiCartPage();

    loginPage.login(customer);
    multiCartPage.createCart();
  };
}
