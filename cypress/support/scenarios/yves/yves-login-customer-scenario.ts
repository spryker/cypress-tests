import { inject, injectable } from 'inversify';
import { YvesLoginPage } from '../../pages/yves/login/yves-login-page';
import { autoWired } from '../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class YvesLoginCustomerScenario {
  constructor(@inject(YvesLoginPage) private loginPage: YvesLoginPage) {}

  public execute = (customer: Customer): void => {
    cy.visit(this.loginPage.PAGE_URL);
    this.loginPage.login(customer);
  };
}
