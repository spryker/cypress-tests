import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { FileManagerAttachmentListRepository } from './file-manager-attachment-list-repository';

@injectable()
@autoWired
export class FileManagerAttachmentListPage extends BackofficePage {
  @inject(FileManagerAttachmentListRepository) private repository: FileManagerAttachmentListRepository;

  protected PAGE_URL = '/ssp-file-management/list';

  verifyListPage(): void {
    cy.get(this.repository.getReferenceHeaderSelector()).should('contain', 'Reference');
    cy.get(this.repository.getFileNameHeaderSelector()).should('contain', 'File Name');
    cy.get(this.repository.getFileSizeHeaderSelector()).should('contain', 'Size');
    cy.get(this.repository.getFileTypeHeaderSelector()).should('contain', 'Type');
    cy.get(this.repository.getUploadedDateHeaderSelector()).should('contain', 'Date Uploaded');
  }

  clickAttachButton(): void {
    this.searchFile();
    cy.get(this.repository.getAttachButtonSelector()).click();
  }

  searchFile(): void {
    cy.intercept('GET', '/ssp-file-management/list/table**').as('fileSearch');
    cy.get(this.repository.getSearchInputSelector()).type('image');
    cy.wait('@fileSearch');
  }

  clickViewButton(): void {
    this.searchFile();
    cy.get(this.repository.getViewButtonSelector()).first().click();
  }

  clickDeleteButton(): void {
    this.searchFile();
    cy.get(this.repository.getDeleteButtonSelector()).first().click();
  }
}
