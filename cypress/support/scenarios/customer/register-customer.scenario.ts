import {LoginPage} from "../../pages/login/login.page";
import {MailCatcherService} from "../../services/mail.catcher.service";

export class RegisterCustomerScenario {
    static execute = () => {
        const loginPage = new LoginPage();

        const customer = loginPage.register();
        MailCatcherService.verifyCustomerEmail(customer.email);

        return {
            email: customer.email,
            password: customer.password,
        };
    }
}
