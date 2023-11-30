import { LoginPage } from "../../pages/yves/login/login.page";
import { MailCatcherHelper } from "../../helpers/mail-catcher-helper";

export class RegisterCustomerScenario {
  static execute = () => {
    const loginPage = new LoginPage();
    const mailCatcherHelper = new MailCatcherHelper();

    const customer = loginPage.register();
    mailCatcherHelper.verifyCustomerEmail(customer.email);

    return {
      email: customer.email,
      password: customer.password,
    };
  };
}
