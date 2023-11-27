import {LoginPage} from "../pages/login/login.page";
import {MultiCartPage} from "../pages/multi-cart/multi.cart.page";

export class LoginAsCustomerScenario {
    static execute = (email?: string, password?: string) => {
        const loginPage = new LoginPage();
        const multiCartPage = new MultiCartPage();

        if (!email || !password) {
            const customer = loginPage.register();

            email = customer.email;
            password = customer.password;
        }

        loginPage.login(email, password);

        return multiCartPage.createNewCart();
    }
}
