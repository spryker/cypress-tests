import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '../../backoffice-page';
import { UserCreateRepository } from './user-create-repository';

@injectable()
@autoWired
export class UserCreatePage extends BackofficePage {
  @inject(UserCreateRepository) private repository: UserCreateRepository;

  protected PAGE_URL = '/user/edit/create';
  private DEFAULT_PASSWORD = 'Change123@_';
  private EN_LOCALE_VALUE = '66';

  createRootUser = () => {
    const user = {
      username: this.faker.internet.email(),
      password: this.DEFAULT_PASSWORD,
    };

    this.fillCreateUserForm(user.username, user.password);

    this.repository.getRootGroupCheckbox().check();
    this.repository.getCreateUserButton().click();
    cy.contains('User was created successfully.').should('exist');

    return user;
  };

  createAgentMerchantUser = () => {
    const user = {
      username: this.faker.internet.email(),
      password: this.DEFAULT_PASSWORD,
    };

    this.fillCreateUserForm(user.username, user.password);

    this.repository.getRootGroupCheckbox().check();
    this.repository.getAgentMerchantCheckbox().check();
    this.repository.getCreateUserButton().click();
    cy.contains('User was created successfully.').should('exist');

    return user;
  };

  private fillCreateUserForm = (username: string, password: string): void => {
    this.repository.getUsernameInput().clear().type(username);
    this.repository.getPasswordInput().clear().type(password);
    this.repository.getRepeatPasswordInput().clear().type(password);
    this.repository.getFirstNameInput().clear().type(this.faker.person.firstName());
    this.repository.getLastNameInput().clear().type(this.faker.person.lastName());
    this.repository.getInterfaceLanguageSelect().select(this.EN_LOCALE_VALUE);
  };
}
