import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../utils/inversify/auto-provide';
import { YvesLoginPage } from '../../pages/yves/login/yves-login-page';
import { MailCatcherHelper } from '../../helpers/mail-catcher-helper';

@injectable()
@autoProvide
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
