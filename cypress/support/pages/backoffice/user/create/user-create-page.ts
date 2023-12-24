import { UserCreateRepository } from './user-create-repository';
import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/auto-provide';
import { User } from '../../../../index';

@injectable()
@autoProvide
export class UserCreatePage extends AbstractPage {
  PAGE_URL = '/user/edit/update';
  DEFAULT_PASSWORD_PREFIX = 'Change123@_';
  EN_LOCALE_VALUE = '66';
  repository: UserCreateRepository;

  constructor(@inject(UserCreateRepository) repository: UserCreateRepository) {
    super();
    this.repository = repository;
  }

  createRootUser = (): User => {
    const user = {
      email: this.faker.internet.email(),
      password: this.DEFAULT_PASSWORD_PREFIX + this.faker.internet.password(),
    };

    this.fillUserForm(user);

    this.repository.getRootGroupCheckbox().check();
    this.repository.getCreateUserButton().click();

    return user;
  };

  createAgentMerchantUser = (): User => {
    const user = {
      email: this.faker.internet.email(),
      password: this.DEFAULT_PASSWORD_PREFIX + this.faker.internet.password(),
    };

    this.fillUserForm(user);

    this.repository.getRootGroupCheckbox().check();
    this.repository.getAgentMerchantCheckbox().check();
    this.repository.getCreateUserButton().click();

    return user;
  };

  private fillUserForm = (user: User): void => {
    this.repository.getUsernameInput().clear().type(user.email);
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
