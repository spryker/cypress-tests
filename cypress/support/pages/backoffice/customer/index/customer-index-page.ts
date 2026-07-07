import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage, ActionEnum } from '@pages/backoffice';
import { CustomerIndexRepository } from './customer-index-repository';
import Chainable = Cypress.Chainable;

@injectable()
@autoWired
export class CustomerIndexPage extends BackofficePage {
  @inject(CustomerIndexRepository) private repository: CustomerIndexRepository;

  protected PAGE_URL = '/customer';

  update = (params: UpdateParams): void => {
    this.find({
      searchQuery: params.searchQuery,
      interceptTableUrl: `**/customer/index/table**`,
    }).then((getRow) => {
      if (!getRow) {
        return;
      }

      if (params.action === ActionEnum.removeMultiFactorAuthentication) {
        getRow().find(this.getRemoveMultiFactorAuthenticationButtonSelector()).click({ force: true });
      }
    });
  };

  findCustomer(params: FindParams): Chainable {
    return this.find({
      searchQuery: params.searchQuery,
      interceptTableUrl: `**/customer/index/table**`,
    }).then((getRow) => (getRow ? getRow() : null));
  }

  getRemoveMultiFactorAuthenticationButtonSelector = (): string =>
    this.repository.getRemoveMultiFactorAuthenticationButtonSelector();
}

interface UpdateParams {
  action: ActionEnum;
  searchQuery: string;
}

interface FindParams {
  searchQuery: string;
}
