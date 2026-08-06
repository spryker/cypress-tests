import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';
import { SspFileManagementAttachRepository } from './ssp-file-management-attach-repository';

type AttachmentScope = 'asset' | 'business-unit' | 'company-user' | 'company';

@injectable()
@autoWired
export class SspFileManagementAttachPage extends BackofficePage {
  @inject(SspFileManagementAttachRepository) private repository: SspFileManagementAttachRepository;

  selectAttachmentScope(scope: AttachmentScope | 'model', options?: Partial<Cypress.ClickOptions>): void {
    const scopeTextMap = {
      asset: 'Asset',
      'business-unit': 'Business Unit',
      'company-user': 'Company User',
      company: 'Company',
      model: 'Model',
    };

    const scopeText = scopeTextMap[scope];
    const scopeOrder = ['asset', 'model', 'business-unit', 'company-user', 'company'];

    cy.get('.nav-tabs', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('a').then(($tabs) => {
          const matchingTab = $tabs.filter((index, element) => {
            const text = Cypress.$(element).text().trim();
            return text.toLowerCase() === scopeText.toLowerCase();
          });

          if (matchingTab.length > 0) {
            cy.wrap(matchingTab).first().click(options);
            return;
          }

          const matchingHrefTab = $tabs.filter((index, element) => {
            const href = Cypress.$(element).attr('href');
            return href === `#tab-content-${scope}`;
          });

          if (matchingHrefTab.length > 0) {
            cy.wrap(matchingHrefTab)
              .first()
              .click(options || { force: true });
            return;
          }

          const tabIndex = scopeOrder.indexOf(scope);
          cy.wrap($tabs)
            .eq(tabIndex)
            .click(options || { force: true });
        });
      });
  }

  private getUnattachedTableSelector(scope: AttachmentScope): string {
    const tableSelectors = {
      asset: this.repository.getUnattachedSspAssetTableSelector(),
      'business-unit': this.repository.getUnattachedBusinessUnitTableSelector(),
      'company-user': this.repository.getUnattachedCompanyUserTableSelector(),
      company: this.repository.getUnattachedCompanyTableSelector(),
    };

    return tableSelectors[scope];
  }

  private getUnattachedSearchSelector(scope: AttachmentScope): string {
    const searchSelectors = {
      asset: this.repository.getAssetTableSearchSelector(),
      'business-unit': this.repository.getBusinessUnitTableSearchSelector(),
      'company-user': this.repository.getCompanyUserTableSearchSelector(),
      company: this.repository.getCompanyTableSearchSelector(),
    };

    return searchSelectors[scope];
  }

  searchUnattachedItem(scope: AttachmentScope, searchTerm: string): void {
    const searchSelector = this.getUnattachedSearchSelector(scope);

    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(searchTerm);
  }

  // Flaked: DataTables filters via a server-side AJAX. Checking the first row
  // before its `_processing` overlay settles ticks a stale/empty row, submits
  // an empty attachment, and (on suite's single seeded asset) removes it from
  // the unattached list so non-DB-resetting retries find nothing and the
  // success toast never fires. The spec waits for this overlay to settle and
  // requires the top row to actually match the search term before checking it.
  getUnattachedProcessingOverlay = (scope: AttachmentScope): Cypress.Chainable =>
    cy.get(`${this.getUnattachedTableSelector(scope)}_processing`, { timeout: 10000 });

  getFirstUnattachedRow = (scope: AttachmentScope): Cypress.Chainable =>
    cy.get(`${this.getUnattachedTableSelector(scope)} tbody tr`).first();

  getTableRowCheckboxSelector = (): string => this.repository.getTableRowCheckboxSelector();

  uploadCsvFile(scope: AttachmentScope, fileName: string): void {
    const csvSelectors = {
      asset: this.repository.getAssetCsvImportSelector(),
      'business-unit': this.repository.getBusinessUnitCsvImportSelector(),
      'company-user': this.repository.getCompanyUserCsvImportSelector(),
      company: this.repository.getCompanyCsvImportSelector(),
    };

    cy.get(csvSelectors[scope]).attachFile(fileName);
  }

  submitForm(): void {
    cy.get(this.repository.getSaveButtonSelector()).first().click({ force: true });

    cy.get(this.repository.getModalSubmitButtonSelector(), { timeout: 10000 }).click({ force: true });
  }

  getSuccessMessage = (): Cypress.Chainable => cy.get(this.repository.getSuccessMessageSelector());

  getFileAttachmentSuccessText = (): string => this.repository.getFileAttachmentSuccessText();
}
