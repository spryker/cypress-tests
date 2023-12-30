import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import { MpAgentLoginRepository } from './mp-agent-login-repository';

@injectable()
@autoProvide
export class MpAgentLoginPage extends AbstractPage {
  public PAGE_URL: string = '/agent-security-merchant-portal-gui/login';

  constructor(
    @inject(MpAgentLoginRepository) private repository: MpAgentLoginRepository
  ) {
    super();
  }

  login = (user: User): void => {
    cy.visitMerchantPortal(this.PAGE_URL);
    this.repository.getEmailInput().clear().type(user.username);
    this.repository.getPasswordInput().clear().type(user.password);

    this.repository.getSubmitButton().click();
  };

  assertFailedAuthentication = (): void => {
    cy.contains(this.repository.getFailedAuthenticationText());
    this.assertPageLocation();
  };
}
