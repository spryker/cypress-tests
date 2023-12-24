import { UserCreateRepository } from './user-create-repository';
import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class UserCreatePage extends AbstractPage {
  PAGE_URL: string = '/user/edit/update';
  DEFAULT_PASSWORD: string = 'Change123@_';
  EN_LOCALE_VALUE: string = '66';
  repository: UserCreateRepository;

  constructor(@inject(UserCreateRepository) repository: UserCreateRepository) {
    super();
    this.repository = repository;
  }

  createRootUser = (): User => {
    const user: User = {
      username: this.faker.internet.email(),
      password: this.DEFAULT_PASSWORD,
    };

    this.fillCreateUserForm(user);

    this.repository.getRootGroupCheckbox().check();
    this.repository.getCreateUserButton().click();
    cy.contains('User was created successfully.').should('exist');

    return user;
  };

  createAgentMerchantUser = (): User => {
    const user: User = {
      username: this.faker.internet.email(),
      password: this.DEFAULT_PASSWORD,
    };

    this.fillCreateUserForm(user);

    this.repository.getRootGroupCheckbox().check();
    this.repository.getAgentMerchantCheckbox().check();
    this.repository.getCreateUserButton().click();
    cy.contains('User was created successfully.').should('exist');

    return user;
  };

  private fillCreateUserForm = (user: User): void => {
    this.repository.getUsernameInput().clear().type(user.username);
    this.repository.getPasswordInput().clear().type(user.password);
    this.repository.getRepeatPasswordInput().clear().type(user.password);
    this.repository
      .getFirstNameInput()
      .clear()
      .type(this.faker.person.firstName());
    this.repository
      .getLastNameInput()
      .clear()
      .type(this.faker.person.lastName());
    this.repository.getInterfaceLanguageSelect().select(this.EN_LOCALE_VALUE);
  };
}
