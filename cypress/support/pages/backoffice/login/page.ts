import { AbstractPage } from '../../abstract-page';
import { Repository } from './repository';

export class Page extends AbstractPage {
  PAGE_URL = '/security-gui/login';
  repository: Repository;

  constructor() {
    super();
    this.repository = new Repository();
  }

  login = (email: string, password: string) => {
    cy.visitBackoffice(this.PAGE_URL);
    this.repository.getEmailInput().clear().type(email);
    this.repository.getPasswordInput().clear().type(password);

    this.repository.getSubmitButton().click();
  };
}
