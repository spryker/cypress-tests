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

  getTableHeaders(): Cypress.Chainable {
    return this.repository.getAssetTableHeaders();
  }

  getRows(): Cypress.Chainable {
    return this.repository.getAssetTableRows();
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
