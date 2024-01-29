import { AbstractPage } from '../../abstract-page';
import { BackofficeLoginRepository } from './backoffice-login-repository';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoWired } from '../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class BackofficeLoginPage extends AbstractPage {
  public PAGE_URL: string = '/security-gui/login';

  constructor(@inject(BackofficeLoginRepository) private repository: BackofficeLoginRepository) {
    super();
  }

  public login = (user: User): void => {
    cy.visitBackoffice(this.PAGE_URL);
    this.repository.getEmailInput().clear().type(user.username);
    this.repository.getPasswordInput().clear().type(user.password);

    this.repository.getSubmitButton().click();
  };
}
