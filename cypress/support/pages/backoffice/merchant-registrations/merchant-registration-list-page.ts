import { injectable } from 'inversify';
import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';

@injectable()
@autoWired
export class MerchantRegistrationListPage extends BackofficePage {
  protected PAGE_URL = '/merchant-registration-request/list';
  private readonly TABLE_URL = '/merchant-registration-request/list/table-data**';

  // Selectors
  private readonly pageTitle = 'h1, .page-header h1';
  private readonly table = 'table.table';
  private readonly tableHeader = 'thead';
  private readonly tableRows = 'tbody tr';
  private readonly searchInput = 'input[type="search"]';
  private readonly sortableColumn = 'th.sorting, th.sorting_asc, th.sorting_desc';

  // Column selectors (DataTables structure)
  private readonly idColumn = 'td:nth-child(1)';
  private readonly createdColumn = 'td:nth-child(2)';
  private readonly merchantColumn = 'td:nth-child(3)';
  private readonly fullNameColumn = 'td:nth-child(4)';
  private readonly emailColumn = 'td:nth-child(5)';
  private readonly statusColumn = 'td:nth-child(6)';
  private readonly actionsColumn = 'td:nth-child(7)';

  // Action buttons
  private readonly viewButton = 'a:contains("View")';

  // Status badges - Spryker uses .label classes
  private readonly statusPending = '.label-warning';
  private readonly statusAccepted = '.label-success';
  private readonly statusRejected = '.label-danger';

  assertPageLoaded(): void {
    cy.url().should('include', this.PAGE_URL);
    cy.get(this.pageTitle).should('be.visible');
  }

  assertPageTitle(expectedTitle: string): void {
    cy.get(this.pageTitle).should('contain.text', expectedTitle);
  }

  assertTableVisible(): void {
    cy.get(this.table).should('be.visible');
  }

  assertTableHeaders(): void {
    cy.get(this.tableHeader).within(() => {
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
    return cy.get(this.tableRows);
  }

  assertRowCount(expectedCount: number): void {
    this.getTableRows().should('have.length', expectedCount);
  }

  sortByColumn(columnName: string): void {
    cy.get(this.tableHeader).contains(columnName).click();
  }

  searchByTerm(searchTerm: string): void {
    cy.get(this.searchInput).clear();
    cy.get(this.searchInput).type(searchTerm);
  }

  filterByStatus(status: 'Pending' | 'Accepted' | 'Rejected'): void {
    cy.get(this.statusColumn).contains(status).should('be.visible');
  }

  update = (params: UpdateParams): void => {
    this.find({ tableUrl: this.TABLE_URL, searchQuery: params.query }).then(($row) => {
      if ($row && params.action === 'view') {
        cy.wrap($row).find(this.viewButton).click();
      }
    });
  };

  viewRegistrationByIndex(index: number): void {
    this.getTableRows().eq(index).find(this.viewButton).click();
  }

  viewRegistrationByEmail(email: string): void {
    this.update({ query: email, action: 'view' });
  }

  assertRegistrationExists(email: string): void {
    cy.contains(this.tableRows, email).should('exist');
  }

  assertStatusColor(status: 'Pending' | 'Accepted' | 'Rejected'): void {
    const statusSelector = {
      Pending: this.statusPending,
      Accepted: this.statusAccepted,
      Rejected: this.statusRejected,
    }[status];

    cy.get(statusSelector).should('exist');
  }

  assertRegistrationWithStatus(email: string, status: string): void {
    cy.contains(this.tableRows, email).within(() => {
      cy.get(this.statusColumn).should('contain.text', status);
    });
  }

  getRowByEmail(email: string): Cypress.Chainable {
    return cy.contains(this.tableRows, email);
  }

  assertCreatedDateFormat(rowIndex: number): void {
    // Verify date format: Aug. 14, 2025 10:49
    this.getTableRows()
      .eq(rowIndex)
      .find(this.createdColumn)
      .invoke('text')
      .should('match', /[A-Z][a-z]{2}\.\s\d{1,2},\s\d{4}\s\d{1,2}:\d{2}/);
  }
}

interface UpdateParams {
  query: string;
  action: 'view';
}
