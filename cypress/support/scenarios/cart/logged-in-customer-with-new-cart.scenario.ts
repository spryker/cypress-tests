import { MultiCartPage } from "../../pages/yves/multi-cart/multi.cart.page";
import { LoginPage } from "../../pages/yves/login/login.page";

export class LoggedInCustomerWithNewCartScenario {
  static execute = (email: string, password: string) => {
    const loginPage = new LoginPage();
    const multiCartPage = new MultiCartPage();

    loginPage.login(email, password);
    multiCartPage.createCart();
  };
}
