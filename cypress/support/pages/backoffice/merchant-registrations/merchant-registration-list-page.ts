import { injectable } from 'inversify';
import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';
import { MerchantRegistrationListRepository } from './merchant-registration-list-repository';

@injectable()
@autoWired
export class MerchantRegistrationListPage extends BackofficePage {
  constructor(private repository: MerchantRegistrationListRepository) {
    super();
  }

  protected PAGE_URL = '/merchant-registration-request/list';
  private readonly TABLE_URL = '/merchant-registration-request/list/table-data**';

  getTable = (): Cypress.Chainable => this.repository.getTable();

  getTableHeader = (): Cypress.Chainable => this.repository.getTableHeader();

  getTableRows(): Cypress.Chainable {
    return this.repository.getTableRows();
  }

  getStatusColumnCells = (): Cypress.Chainable => cy.get(this.repository.getStatusColumn());

  getStatusCellForEmail = (email: string): Cypress.Chainable =>
    this.repository.getTableRows().contains(email).closest('tr').find(this.repository.getStatusColumn());

  getStatusBadge = (status: 'Pending' | 'Accepted' | 'Rejected'): Cypress.Chainable => {
    const statusSelector = {
      Pending: this.repository.getStatusPendingBadge(),
      Accepted: this.repository.getStatusAcceptedBadge(),
      Rejected: this.repository.getStatusRejectedBadge(),
    }[status];

    return cy.get(statusSelector);
  };

  sortByColumn(columnName: string): void {
    this.repository.getTableHeader().contains(columnName).click();
  }

  searchByTerm(searchTerm: string): void {
    this.repository.getSearchInput().clear().type(searchTerm);
  }

  update = (params: UpdateParams): void => {
    this.find({
      interceptTableUrl: this.TABLE_URL,
      searchQuery: params.query,
      expectedToSeeInTable: params.query,
    }).then((getRow) => {
      if (!getRow) {
        return;
      }

      if (params.action === 'view') {
        getRow().find(this.repository.getViewButton()).click();
      }
    });
  };

  viewRegistrationByIndex(index: number): void {
    this.getTableRows()
      .eq(index)
      .within(() => {
        cy.get(this.repository.getViewButton()).click();
      });
  }

  viewRegistrationByEmail(email: string): void {
    this.update({ query: email, action: 'view' });
  }
}

interface UpdateParams {
  query: string;
  action: 'view';
}
