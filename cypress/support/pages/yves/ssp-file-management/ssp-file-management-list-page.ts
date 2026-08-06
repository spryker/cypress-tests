import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { SspFileManagementRepository } from './ssp-file-management-repository';

@injectable()
@autoWired
export class SspFileManagementListPage extends YvesPage {
  @inject(SspFileManagementRepository) private repository: SspFileManagementRepository;

  protected PAGE_URL = '/customer/ssp-file/list-file';

  getFileTable = (): Cypress.Chainable => cy.get(this.repository.getFileTableSelector());

  getFileRow = (fileName: string): Cypress.Chainable =>
    cy.get(this.repository.getFileTableSelector()).find('tr').contains(fileName);

  getFileRows = (): Cypress.Chainable => cy.get(this.repository.getFileTableSelector()).find('tr');

  downloadFile(fileName: string): void {
    cy.get(this.repository.getFileTableSelector())
      .find('tr')
      .contains(fileName)
      .parent()
      .find(this.repository.getDownloadButtonSelector())
      .click();
  }

  getDownloadedFile = (fileName: string): Cypress.Chainable =>
    cy.readFile(Cypress.config('downloadsFolder') + '/' + fileName);

  filterByType(fileType: string): void {
    cy.get(this.repository.getTypeFilterSelector()).select(fileType, { force: true });
    cy.get(this.repository.getApplyFiltersButtonSelector()).click();
  }

  filterByBusinessEntity(accessLevel: string): void {
    cy.get(this.repository.getBusinessEntityFilterSelector()).select(accessLevel, { force: true });
  }

  filterBySspAssetEntity(accessLevel: string): void {
    cy.get(this.repository.getSspAssetEntityFilterSelector()).select(accessLevel, { force: true });
  }

  searchByName(searchTerm: string): void {
    cy.get(this.repository.getSearchFieldSelector()).clear();
    cy.get(this.repository.getSearchFieldSelector()).type(searchTerm);
    cy.get(this.repository.getApplyFiltersButtonSelector()).click();
  }

  applyFilterByTypeAndSearchTerm(searchTerm: string, fileType: string): void {
    cy.get(this.repository.getSearchFieldSelector()).clear();
    cy.get(this.repository.getSearchFieldSelector()).type(searchTerm);
    cy.get(this.repository.getTypeFilterSelector()).select(fileType, { force: true });
    cy.get(this.repository.getApplyFiltersButtonSelector()).click();
  }

  applyFilters(): void {
    cy.get(this.repository.getApplyFiltersButtonSelector()).click();
  }

  openFilters(): void {
    cy.get(this.repository.getFiltersTriggerSelector()).click();
  }
}
