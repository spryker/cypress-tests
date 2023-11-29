import { LoginPage } from "../../pages/login/login.page";

export class LoginCustomerScenario {
    static execute = (email: string, password: string) => {
        const loginPage = new LoginPage();

        loginPage.login(email, password);
    }
}
