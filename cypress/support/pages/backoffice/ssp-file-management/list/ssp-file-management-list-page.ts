import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { SspFileManagementListRepository } from './ssp-file-management-list-repository';

@injectable()
@autoWired
export class SspFileManagementListPage extends BackofficePage {
  @inject(SspFileManagementListRepository) private repository: SspFileManagementListRepository;

  protected PAGE_URL = '/self-service-portal/list-file';

  verifyListPage(): void {
    cy.get(this.repository.getReferenceHeaderSelector()).should('contain', 'Reference');
    cy.get(this.repository.getFileNameHeaderSelector()).should('contain', 'File Name');
    cy.get(this.repository.getFileSizeHeaderSelector()).should('contain', 'Size');
    cy.get(this.repository.getFileTypeHeaderSelector()).should('contain', 'Type');
    cy.get(this.repository.getUploadedDateHeaderSelector()).should('contain', 'Date Uploaded');
  }

  clickAttachButton(): void {
    this.searchFile('image2.png');
    cy.get(this.repository.getAttachButtonSelector()).first().click();
  }

  searchFile(fileName: string): void {
    cy.intercept('GET', '/self-service-portal/list-file/table**').as('fileSearch');
    cy.get(this.repository.getSearchInputSelector()).clear();
    cy.get(this.repository.getSearchInputSelector()).type(fileName);
    cy.wait('@fileSearch');
  }

  clickViewButton(): void {
    this.searchFile('image2.png');
    cy.get(this.repository.getViewButtonSelector()).first().click();
  }

  clickDeleteButton(): void {
    this.searchFile('image1.jpeg');
    cy.get(this.repository.getDeleteButtonSelector()).first().click();
  }
}
