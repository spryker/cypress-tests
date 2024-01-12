import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import { BackofficeUserCreateRepository } from './backoffice-user-create-repository';

@injectable()
@autoProvide
export class BackofficeUserCreatePage extends AbstractPage {
  public PAGE_URL: string = '/user/edit/update';

  private DEFAULT_PASSWORD: string = 'Change123@_';
  private EN_LOCALE_VALUE: string = '66';

  constructor(
    @inject(BackofficeUserCreateRepository)
    private repository: BackofficeUserCreateRepository
  ) {
    super();
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
    this.repository.getFirstNameInput().clear().type(this.faker.person.firstName());
    this.repository.getLastNameInput().clear().type(this.faker.person.lastName());
    this.repository.getInterfaceLanguageSelect().select(this.EN_LOCALE_VALUE);
  };
}
