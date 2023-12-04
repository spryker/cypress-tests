import { AbstractPage } from '../../abstract-page';
import { Repository } from './repository';
import { User } from '../../../index';

export class Page extends AbstractPage {
  PAGE_URL = '/security-gui/login';
  repository: Repository;

  constructor() {
    super();
    this.repository = new Repository();
  }

  login = (user: User) => {
    cy.visitBackoffice(this.PAGE_URL);
    this.repository.getEmailInput().clear().type(user.email);
    this.repository.getPasswordInput().clear().type(user.password);

    this.repository.getSubmitButton().click();
  };
}
