import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { SspFileManagementRepository } from './ssp-file-management-repository';

@injectable()
@autoWired
export class SspFileManagementListPage extends YvesPage {
  @inject(SspFileManagementRepository) private repository: SspFileManagementRepository;

  protected PAGE_URL = '/ssp/company-file/list-file';

  verifyListPage(): void {
    cy.get(this.repository.getFiltersSelector()).should('be.visible');
  }

  assertFileExists(fileName: string): void {
    cy.get(this.repository.getFileTableSelector()).find('tr').contains(fileName).should('be.visible');
  }

  assertFileNotExists(fileName: string): void {
    cy.get(this.repository.getFileTableSelector()).find('tr').contains(fileName).should('not.exist');
  }

  assertNoResults(): void {
    cy.get(this.repository.getFileTableSelector()).find('tr').should('not.exist');
  }

  downloadFile(fileName: string): void {
    cy.get(this.repository.getFileTableSelector())
      .find('tr')
      .contains(fileName)
      .parent()
      .find(this.repository.getDownloadButtonSelector())
      .click();
  }

  verifyFileDownloaded(fileName: string): void {
    cy.readFile(Cypress.config('downloadsFolder') + '/' + fileName).should('exist');
  }

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

  verifyFilterValues(searchTerm: string, fileType: string): void {
    cy.get(this.repository.getSearchFieldSelector()).should('have.value', searchTerm);
    cy.get(this.repository.getTypeFilterSelector()).should('have.value', fileType.toLowerCase());
  }

  applyFilters(): void {
    cy.get(this.repository.getApplyFiltersButtonSelector()).click();
  }
}
