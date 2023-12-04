import { MailCatcherHelper } from '../helpers/mail-catcher-helper';
import { Customer } from '../index';
import { Page as LoginPage } from '../pages/yves/login/page';

export class RegisterCustomerScenario {
  static execute = (): Customer => {
    const customer = new LoginPage().register();
    new MailCatcherHelper().verifyCustomerEmail(customer.email);

    return customer;
  };
}
