import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ServicePointListRepository } from './service-point-list-repository';

@injectable()
@autoWired
export class ServicePointListPage extends BackofficePage {
  @inject(ServicePointListRepository) private repository: ServicePointListRepository;

  protected PAGE_URL = '/service-point/list';
  protected TABLE_URL = '/service-point/list/table';

  findByKey = (key: string): Cypress.Chainable => {
    return this.find({ interceptTableUrl: this.TABLE_URL + '**', searchQuery: key, expectedCount: 1 }).then((getRow) =>
      getRow ? getRow() : null
    );
  };

  getTableRows = (): Cypress.Chainable => {
    return cy.get(this.repository.getTableRowsSelector());
  };

  getAddressColumn = (): Cypress.Chainable => {
    return cy.get(this.repository.getAddressColumnSelector());
  };

  getStoresColumn = (): Cypress.Chainable => {
    return cy.get(this.repository.getStoresColumnSelector());
  };

  getServiceTypesColumn = (): Cypress.Chainable => {
    return cy.get(this.repository.getServiceTypesColumnSelector());
  };

  getAddressCell = (): Cypress.Chainable => {
    return this.getTableRows().find(this.repository.getAddressCellSelector());
  };

  getStatusCell = (): Cypress.Chainable => {
    return this.getTableRows().find(this.repository.getStatusCellSelector());
  };

  getViewButton = (): Cypress.Chainable => {
    return cy.get(this.repository.getViewButtonSelector());
  };
}
