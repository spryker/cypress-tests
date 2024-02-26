import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { MpLoginRepository } from './mp-login-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';
import { MpPage } from '../mp-page';

@injectable()
@autoWired
export class MpLoginPage extends MpPage {
  protected PAGE_URL: string = '/security-merchant-portal-gui/login';

  constructor(@inject(MpLoginRepository) private repository: MpLoginRepository) {
    super();
  }

  public login = (username: string, password: string): void => {
    cy.visitMerchantPortal(this.PAGE_URL);
    this.repository.getEmailInput().clear().type(username);
    this.repository.getPasswordInput().clear().type(password);

    this.repository.getSubmitButton().click();
  };

  public getFailedAuthenticationText = (): string => {
    return this.repository.getFailedAuthenticationText();
  };
}
