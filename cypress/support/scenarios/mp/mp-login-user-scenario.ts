import { inject, injectable } from 'inversify';
import { MpLoginPage } from '../../pages/mp/login/mp-login-page';
import { autoWired } from '../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class MpLoginUserScenario {
  constructor(@inject(MpLoginPage) private loginPage: MpLoginPage) {}

  public execute = (user: User): void => {
    cy.visitMerchantPortal(this.loginPage.PAGE_URL);
    this.loginPage.login(user);
  };
}
