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

  assertPageLoaded(): void {
    cy.url().should('include', this.PAGE_URL);
    this.repository.getTable().should('be.visible');
  }

  assertTableVisible(): void {
    this.repository.getTable().should('be.visible');
  }

  assertTableHeaders(): void {
    this.repository.getTableHeader().within(() => {
      cy.contains('ID').should('be.visible');
      cy.contains('Created').should('be.visible');
      cy.contains('Merchant').should('be.visible');
      cy.contains(/Full name|Name/).should('be.visible');
      cy.contains('Email').should('be.visible');
      cy.contains('Status').should('be.visible');
      cy.contains('Actions').should('be.visible');
    });
  }

  getTableRows(): Cypress.Chainable {
    return this.repository.getTableRows();
  }

  sortByColumn(columnName: string): void {
    this.repository.getTableHeader().contains(columnName).click();
  }

  searchByTerm(searchTerm: string): void {
    this.repository.getSearchInput().clear().type(searchTerm);
  }

  filterByStatus(status: 'Pending' | 'Accepted' | 'Rejected'): void {
    cy.get(this.repository.getStatusColumn()).contains(status).should('be.visible');
  }

  update = (params: UpdateParams): void => {
    this.find({ tableUrl: this.TABLE_URL, searchQuery: params.query }).then(($row) => {
      if ($row && params.action === 'view') {
        cy.wrap($row).within(() => {
          cy.get(this.repository.getViewButton()).click();
        });
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

  assertRegistrationExists(email: string): void {
    this.repository.getTableRows().contains(email).should('exist');
  }

  assertStatusColor(status: 'Pending' | 'Accepted' | 'Rejected'): void {
    const statusSelector = {
      Pending: this.repository.getStatusPendingBadge(),
      Accepted: this.repository.getStatusAcceptedBadge(),
      Rejected: this.repository.getStatusRejectedBadge(),
    }[status];

    cy.get(statusSelector).should('exist');
  }

  assertRegistrationWithStatus(email: string, status: string): void {
    this.repository
      .getTableRows()
      .contains(email)
      .within(() => {
        cy.get(this.repository.getStatusColumn()).should('contain.text', status);
      });
  }
}

interface UpdateParams {
  query: string;
  action: 'view';
}
