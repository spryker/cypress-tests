import { BackofficeUserUpdateRepository } from './backoffice-user-update-repository';
import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class BackofficeUserUpdatePage extends AbstractPage {
  public PAGE_URL: string = '/user/edit/update';

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
}
