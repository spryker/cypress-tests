import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { YvesLoginPage } from '../../pages/yves/login/yves-login-page';
import { MailCatcherHelper } from '../../helpers/mail-catcher-helper';
import { autoWired } from '../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class RegisterCustomerScenario {
  constructor(
    @inject(YvesLoginPage) private loginPage: YvesLoginPage,
    @inject(MailCatcherHelper) private mailCatcherHelper: MailCatcherHelper
  ) {}

  public execute = (): Customer => {
    const customer: Customer = this.loginPage.register();
    this.mailCatcherHelper.verifyCustomerEmail(customer.email);

    return customer;
  };
}
