import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import { MpLoginRepository } from './mp-login-repository';

@injectable()
@autoProvide
export class MpLoginPage extends AbstractPage {
  public PAGE_URL: string = '/security-merchant-portal-gui/login';

  constructor(@inject(MpLoginRepository) private repository: MpLoginRepository) {
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
