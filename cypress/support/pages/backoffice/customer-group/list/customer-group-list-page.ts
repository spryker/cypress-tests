import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { CustomerGroupListRepository } from './customer-group-list-repository';

@injectable()
@autoWired
export class CustomerGroupListPage extends BackofficePage {
  @inject(REPOSITORIES.CustomerGroupListRepository) private repository: CustomerGroupListRepository;

  protected PAGE_URL = '/customer-group';

  getSuccessMessage = (): Cypress.Chainable => this.repository.getSuccessMessage();

  openViewPage = (name: string): void => {
    this.find({
      searchQuery: name,
      interceptTableUrl: '**/customer-group/index/table**',
      expectedCount: 1,
      expectedToSeeInTable: name,
    }).then((getRow) => {
      if (!getRow) {
        return;
      }

      getRow().find(this.repository.getViewButtonSelector()).click();
    });
  };
}
