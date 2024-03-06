import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BackofficePage } from '../../backoffice-page';
import { UserUpdateRepository } from './user-update-repository';

@injectable()
@autoWired
export class UserUpdatePage extends BackofficePage {
  protected PAGE_URL: string = '/user/edit/update';
  public DEFAULT_PASSWORD: string = 'Change123@_';

  constructor(@inject(UserUpdateRepository) private repository: UserUpdateRepository) {
    super();
  }

  public checkMerchantAgentCheckbox = (): void => {
    this.getAgentMerchantCheckbox().check();
    this.repository.getUpdateUserButton().click();
  };

  public getAgentMerchantCheckbox = (): Cypress.Chainable => {
    return this.repository.getAgentMerchantCheckbox();
  };

  public getAgentCustomerCheckbox = (): Cypress.Chainable => {
    return this.repository.getAgentCustomerCheckbox();
  };

  public setDefaultPassword = (): void => {
    this.repository.getPasswordInput().clear().type(this.DEFAULT_PASSWORD);
    this.repository.getRepeatPasswordInput().clear().type(this.DEFAULT_PASSWORD);
    this.repository.getUpdateUserButton().click();
  };
}
