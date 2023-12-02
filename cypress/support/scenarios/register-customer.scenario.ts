import { MailCatcherHelper } from '../helpers/mail-catcher-helper';
import { Customer } from '../index';
import { Page as LoginPage } from '../pages/yves/login/page';

export class RegisterCustomerScenario {
  static execute = (): Customer => {
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
