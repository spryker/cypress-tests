import { LoginRepository } from './login.repository';
import { Page } from '../../page';

export class LoginPage extends Page {
  PAGE_URL = '/security-gui/login';
  repository: LoginRepository;

  constructor() {
    super();
    this.repository = new LoginRepository();
  }

  login = (email: string, password: string) => {
    cy.visitBackoffice(this.PAGE_URL);
    this.repository.getEmailInput().clear().type(email);
    this.repository.getPasswordInput().clear().type(password);

    this.repository.getSubmitButton().click();
  };
}
