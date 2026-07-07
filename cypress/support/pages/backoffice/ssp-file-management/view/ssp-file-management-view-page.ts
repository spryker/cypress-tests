import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';
import { SspFileManagementViewRepository } from './ssp-file-management-view-repository';

@injectable()
@autoWired
export class SspFileManagementViewPage extends BackofficePage {
  @inject(SspFileManagementViewRepository) private repository: SspFileManagementViewRepository;

  getFileName = (): Cypress.Chainable => cy.get(this.repository.getFileNameSelector());

  getUploadedDate = (): Cypress.Chainable => cy.get(this.repository.getUploadedDateSelector());

  getFileSize = (): Cypress.Chainable => cy.get(this.repository.getFileSizeSelector());

  getFileType = (): Cypress.Chainable => cy.get(this.repository.getFileTypeSelector());

  getLinkedEntities = (): Cypress.Chainable => cy.get(this.repository.getLinkedEntitiesSelector());
}
