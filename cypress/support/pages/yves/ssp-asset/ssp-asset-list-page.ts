import { YvesPage } from '@pages/yves';
import { SspAssetRepository } from './ssp-asset-repository';
import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class SspAssetListPage extends YvesPage {
  @inject(REPOSITORIES.SspAssetRepository) private repository: SspAssetRepository;

  protected PAGE_URL = '/customer/ssp-asset';

  getCreateAssetButton(): Cypress.Chainable {
    return this.repository.getCreateAssetButton();
  }

  getFirstRowReference(): Cypress.Chainable<string> {
    return this.repository.getFirstRowReference();
  }

  openLatestAssetDetailsPage(): void {
    this.repository.getFirstRowViewButton().click();
  }

  assertTableHeaders(expectedHeaders: string[]): void {
    this.repository.getAssetTableHeaders().each(($header, index) => {
      if (index < expectedHeaders.length && expectedHeaders[index]) {
        cy.wrap($header).contains(new RegExp(expectedHeaders[index], 'i')).should('exist');
      }
    });
  }

  getRows(): Cypress.Chainable {
    return this.repository.getAssetTableRows();
  }

  assertTableData(sspAssets: SspAsset[]): void {
    this.getRows().its('length').should('eq', sspAssets.length);

    sspAssets.forEach((sspAsset) => {
      if (sspAsset.reference) {
        this.getRows().contains(sspAsset.reference).should('exist');
      }
      if (sspAsset.name) {
        this.getRows().contains(sspAsset.name).should('exist');
      }
    });
  }

  getSspAssetCustomerMenuItem(): Cypress.Chainable {
    return this.repository.getSspAssetCustomerMenuItem();
  }

  getAccessTableFilterSelect(): Cypress.Chainable {
    return this.repository.getAccessTableFilterSelect();
  }

  getSspAssetFiltersSubmitButton(): Cypress.Chainable {
    return this.repository.getSspAssetFiltersSubmitButton();
  }

  getAccessTableFilterByCompanyValue(): string {
    return 'filterByCompany';
  }

  openFilters(): void {
    cy.get(this.repository.getFiltersTriggerSelector()).click();
  }
}

interface SspAsset {
  reference?: string;
  name?: string;
}
