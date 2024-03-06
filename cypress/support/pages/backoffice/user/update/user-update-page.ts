import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BackofficePage } from '../../backoffice-page';
import { UserUpdateRepository } from './user-update-repository';

@injectable()
@autoWired
export class UserUpdatePage extends BackofficePage {
  @inject(UserUpdateRepository) private repository: UserUpdateRepository;

  protected PAGE_URL = '/user/edit/update';
  protected DEFAULT_PASSWORD = 'Change123@_';

  checkMerchantAgentCheckbox = (): void => {
    this.getAgentMerchantCheckbox().check();
    this.repository.getUpdateUserButton().click();
  };

  getAgentMerchantCheckbox = (): Cypress.Chainable => {
    return this.repository.getAgentMerchantCheckbox();
  };

  getAgentCustomerCheckbox = (): Cypress.Chainable => {
    return this.repository.getAgentCustomerCheckbox();
  };

  setDefaultPassword = (): void => {
    this.repository.getPasswordInput().clear().type(this.DEFAULT_PASSWORD);
    this.repository.getRepeatPasswordInput().clear().type(this.DEFAULT_PASSWORD);
    this.repository.getUpdateUserButton().click();
  };
}
