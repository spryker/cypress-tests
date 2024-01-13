import { inject, injectable } from 'inversify';
import { autoProvide } from '../../utils/inversify/auto-provide';
import { YvesLoginPage } from '../../pages/yves/login/yves-login-page';

@injectable()
@autoProvide
export class YvesLoginCustomerScenario {
  constructor(@inject(YvesLoginPage) private loginPage: YvesLoginPage) {}

  public execute = (customer: Customer): void => {
    this.loginPage.login(customer);
  };
}
