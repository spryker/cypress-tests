import { AbstractPage } from '../../abstract-page';
import { BackofficeLoginRepository } from './backoffice-login-repository';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class BackofficeLoginPage extends AbstractPage {
  public PAGE_URL: string = '/security-gui/login';

  constructor(@inject(BackofficeLoginRepository) private repository: BackofficeLoginRepository) {
    super();
  }

  public login = (username: string, password: string): void => {
    cy.session([username, password], () => {
      cy.visitBackoffice(this.PAGE_URL);
      this.repository.getEmailInput().clear().type(username);
      this.repository.getPasswordInput().clear().type(password);

      this.repository.getSubmitButton().click();
    });
  };
}
