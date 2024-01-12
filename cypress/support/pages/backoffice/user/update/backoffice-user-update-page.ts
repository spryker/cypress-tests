import { BackofficeUserUpdateRepository } from './backoffice-user-update-repository';
import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class BackofficeUserUpdatePage extends AbstractPage {
  public PAGE_URL: string = '/user/edit/update';

  constructor(
    @inject(BackofficeUserUpdateRepository)
    private repository: BackofficeUserUpdateRepository
  ) {
    super();
  }

  checkMerchantAgentCheckbox = (): void => {
    this.repository.getAgentMerchantCheckbox().check();
    this.repository.getUpdateUserButton().click();
  };

  ensureAgentMerchantCheckboxIsChecked = (): void => {
    this.repository.getAgentMerchantCheckbox().should('be.checked');
  };

  ensureAgentMerchantCheckboxIsNotChecked = (): void => {
    this.repository.getAgentMerchantCheckbox().should('not.be.checked');
  };

  assertAgentCustomerCheckbox = (): void => {
    this.repository.getAgentCustomerCheckbox().should('exist').parent().contains('This user is an agent in Storefront');
  };

  assertAgentMerchantCheckbox = (): void => {
    this.repository
      .getAgentMerchantCheckbox()
      .should('exist')
      .parent()
      .contains('This user is an agent in Merchant Portal');
  };
}
