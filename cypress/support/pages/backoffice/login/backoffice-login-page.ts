import { AbstractPage } from '../../abstract-page';
import { BackofficeLoginRepository } from './backoffice-login-repository';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class BackofficeLoginPage extends AbstractPage {
  PAGE_URL: string = '/security-gui/login';
  repository: BackofficeLoginRepository;

  constructor(
    @inject(BackofficeLoginRepository) repository: BackofficeLoginRepository
  ) {
    super();
    this.repository = repository;
  }

  login = (user: User): void => {
    cy.visitBackoffice(this.PAGE_URL);
    this.repository.getEmailInput().clear().type(user.username);
    this.repository.getPasswordInput().clear().type(user.password);

    this.repository.getSubmitButton().click();
  };
}
