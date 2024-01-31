import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { MpAgentLoginRepository } from './mp-agent-login-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class MpAgentLoginPage extends AbstractPage {
  public PAGE_URL: string = '/agent-security-merchant-portal-gui/login';

  constructor(@inject(MpAgentLoginRepository) private repository: MpAgentLoginRepository) {
    super();
  }

  public login = (user: User): void => {
    cy.visitMerchantPortal(this.PAGE_URL);
    this.repository.getEmailInput().clear().type(user.username);
    this.repository.getPasswordInput().clear().type(user.password);

    this.repository.getSubmitButton().click();
  };

  public getFailedAuthenticationText = (): string => {
    return this.repository.getFailedAuthenticationText();
  };
}
