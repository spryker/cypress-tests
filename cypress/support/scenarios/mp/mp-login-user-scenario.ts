import { inject, injectable } from 'inversify';
import { autoProvide } from '../../utils/inversify/auto-provide';
import { MpLoginPage } from '../../pages/mp/login/mp-login-page';

@injectable()
@autoProvide
export class MpLoginUserScenario {
  constructor(@inject(MpLoginPage) private loginPage: MpLoginPage) {}

  public execute = (user: User): void => {
    cy.visitMerchantPortal(this.loginPage.PAGE_URL);
    this.loginPage.login(user);
  };
}
