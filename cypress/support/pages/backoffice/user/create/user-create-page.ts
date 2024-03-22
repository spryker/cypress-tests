import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { UserCreateRepository } from './user-create-repository';

@injectable()
@autoWired
export class UserCreatePage extends BackofficePage {
  @inject(UserCreateRepository) private repository: UserCreateRepository;

  protected PAGE_URL = '/user/edit/create';
  private DEFAULT_PASSWORD = 'Change123@_';
  private EN_LOCALE_VALUE = '66';

  create = (params: CreateParams): User => {
    const user = {
      username: params.username || this.faker.internet.email(),
      password: params.password || this.DEFAULT_PASSWORD,
    };

    this.repository.getUsernameInput().clear().type(user.username);
    this.repository.getPasswordInput().clear().type(user.password);
    this.repository.getRepeatPasswordInput().clear().type(user.password);
    this.repository.getFirstNameInput().clear().type(this.faker.person.firstName());
    this.repository.getLastNameInput().clear().type(this.faker.person.lastName());
    this.repository.getInterfaceLanguageSelect().select(this.EN_LOCALE_VALUE);

    if (params.isRootUser) {
      this.repository.getRootGroupCheckbox().check();
    }

    if (params.isAgentMerchant) {
      this.repository.getAgentMerchantCheckbox().check();
    }

    this.repository.getCreateUserButton().click();

    return user;
  };
}

interface CreateParams {
  username?: string;
  password?: string;
  isRootUser?: boolean;
  isAgentMerchant?: boolean;
}

interface User {
  username: string;
  password: string;
}
