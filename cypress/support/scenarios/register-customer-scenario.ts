import { MailCatcherHelper } from '../helpers/mail-catcher-helper';
import { Page as LoginPage } from '../pages/yves/login/page';
import { inject, injectable } from 'inversify';
import { autoProvide } from '../utils/inversify/auto-provide';
import 'reflect-metadata';

@injectable()
@autoProvide
export class RegisterCustomerScenario {
  constructor(
    @inject(LoginPage) private loginPage: LoginPage,
    @inject(MailCatcherHelper) private mailCatcherHelper: MailCatcherHelper
  ) {}
  execute = (): Customer => {
    const customer: Customer = this.loginPage.register();
    this.mailCatcherHelper.verifyCustomerEmail(customer.email);

    return customer;
  };
}
