import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { StoreEditRepository } from './store-edit-repository';

@injectable()
@autoWired
export class StoreEditPage extends BackofficePage {
  @inject(StoreEditRepository) private repository: StoreEditRepository;

  protected PAGE_URL = '/store-gui/edit';

  getDefaultLocaleSelect = (): Cypress.Chainable => this.repository.getDefaultLocaleSelect();

  getDefaultCurrencySelect = (): Cypress.Chainable => this.repository.getDefaultCurrencySelect();

  // The checkbox is added by a store form expander that only renders while the store table carries
  // the visibility column, which is opt-in per project.
  getVisibleToCustomerCheckbox = (): Cypress.Chainable => this.repository.getVisibleToCustomerCheckbox();
}
