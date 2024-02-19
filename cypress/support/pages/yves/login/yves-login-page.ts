import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../utils/inversify/types';
import 'reflect-metadata';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import { YvesLoginRepository } from './yves-login-repository';

@injectable()
@autoProvide
export class YvesLoginPage extends AbstractPage {
  public PAGE_URL: string = '/login';

  private DEFAULT_SALUTATION: string = 'Mr';
  private DEFAULT_PASSWORD_PREFIX: string = 'Change123@_';

  constructor(@inject(TYPES.YvesLoginRepository) private repository: YvesLoginRepository) {
    super();
  }

  public login = (email: string, password: string): void => {
    cy.session([email, password], () => {
      cy.visit(this.PAGE_URL);
      this.repository.getLoginEmailInput().clear().type(email);
      this.repository.getLoginPasswordInput().clear().type(password);

      this.repository.getLoginForm().submit();
    });
  };

  public getFailedAuthenticationText = (): string => {
    return this.repository.getFailedAuthenticationText();
  };
}
