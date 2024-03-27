import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { MerchantUpdateRepository } from './merchant-update-repository';

@injectable()
@autoWired
export class MerchantUpdatePage extends BackofficePage {
  @inject(MerchantUpdateRepository) private repository: MerchantUpdateRepository;

  protected PAGE_URL = '/merchant-gui/edit-merchant';

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(params.query);

    this.interceptTable({ url: '/merchant-user-gui/index/table**', expectedCount: params.expectedCount });

    return this.repository.getFirstTableRow();
  };

  create = (): void => {
    this.repository.getUsersTab().click();
    this.repository.getAddMerchantUserButton().click();
  };
}

interface FindParams {
  query: string;
  expectedCount?: number;
}
