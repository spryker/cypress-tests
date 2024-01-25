import { BackofficeUserUpdateRepository } from './backoffice-user-update-repository';
import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class BackofficeUserUpdatePage extends AbstractPage {
  public PAGE_URL: string = '/user/edit/update';
  public DEFAULT_PASSWORD: string = 'Change123@_';

  constructor(@inject(BackofficeUserUpdateRepository) private repository: BackofficeUserUpdateRepository) {
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
