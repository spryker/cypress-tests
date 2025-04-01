import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { SspFileManagementListRepository } from './ssp-file-management-list-repository';

@injectable()
@autoWired
export class SspFileManagementListPage extends YvesPage {
  @inject(SspFileManagementListRepository) private repository: SspFileManagementListRepository;

  protected PAGE_URL = '/customer/files';

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
    cy.get(this.repository.getTypeFilterSelector()).select(fileType, {force: true});
    cy.get(this.repository.getApplyFiltersButtonSelector()).click();
  }

  searchByName(searchTerm: string): void {
    cy.get(this.repository.getSearchFieldSelector()).clear();
    cy.get(this.repository.getSearchFieldSelector()).type(searchTerm);
    cy.get(this.repository.getApplyFiltersButtonSelector()).click();
  }

  applyFilters(searchTerm: string, fileType: string): void {
    cy.get(this.repository.getSearchFieldSelector()).clear();
    cy.get(this.repository.getSearchFieldSelector()).type(searchTerm);
    cy.get(this.repository.getTypeFilterSelector()).select(fileType, {force: true});
    cy.get(this.repository.getApplyFiltersButtonSelector()).click();
  }

  verifyFilterValues(searchTerm: string, fileType: string): void {
    cy.get(this.repository.getSearchFieldSelector()).should('have.value', searchTerm);
    cy.get(this.repository.getTypeFilterSelector()).should('have.value', fileType.toLowerCase());
  }
}
