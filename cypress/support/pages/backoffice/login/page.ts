import { AbstractPage } from '../../abstract-page';
import { Repository } from './repository';
import { User } from '../../../index';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../utils/auto-provide';

@injectable()
@autoProvide
export class Page extends AbstractPage {
  PAGE_URL = '/security-gui/login';
  repository: Repository;

  constructor(@inject(Repository) repository: Repository) {
    super();
    this.repository = repository;
  }

  login = (user: User) => {
    cy.visitBackoffice(this.PAGE_URL);
    this.repository.getEmailInput().clear().type(user.email);
    this.repository.getPasswordInput().clear().type(user.password);

    this.repository.getSubmitButton().click();
  };
}
