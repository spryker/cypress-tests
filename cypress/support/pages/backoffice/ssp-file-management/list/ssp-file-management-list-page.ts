import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { SspFileManagementListRepository } from './ssp-file-management-list-repository';

@injectable()
@autoWired
export class SspFileManagementListPage extends BackofficePage {
  @inject(SspFileManagementListRepository) private repository: SspFileManagementListRepository;

  protected PAGE_URL = '/self-service-portal/list-file';

  getReferenceHeader = (): Cypress.Chainable => cy.get(this.repository.getReferenceHeaderSelector());

  getFileNameHeader = (): Cypress.Chainable => cy.get(this.repository.getFileNameHeaderSelector());

  getFileSizeHeader = (): Cypress.Chainable => cy.get(this.repository.getFileSizeHeaderSelector());

  getFileTypeHeader = (): Cypress.Chainable => cy.get(this.repository.getFileTypeHeaderSelector());

  getUploadedDateHeader = (): Cypress.Chainable => cy.get(this.repository.getUploadedDateHeaderSelector());

  clickAttachButton(): void {
    this.searchFile('image2.png');
    cy.get(this.repository.getAttachButtonSelector()).first().click();
  }

  searchFile(fileName: string): void {
    cy.intercept('GET', '/self-service-portal/list-file/table**').as('fileSearch');
    cy.get(this.repository.getSearchInputSelector()).type(`{selectall}${fileName}`);
    cy.wait('@fileSearch', { timeout: 1000 });
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
