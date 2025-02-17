import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';
import { SspFileManagementViewRepository } from './ssp-file-management-view-repository';

@injectable()
@autoWired
export class SspFileManagementViewPage extends BackofficePage {
  @inject(SspFileManagementViewRepository) private repository: SspFileManagementViewRepository;

  verifyFileDetailsAreVisible(): void {
    cy.get(this.repository.getFileNameSelector()).should('be.visible');
    cy.get(this.repository.getUploadedDateSelector()).should('be.visible');
    cy.get(this.repository.getFileSizeSelector()).should('be.visible');
    cy.get(this.repository.getFileTypeSelector()).should('be.visible');
    cy.get(this.repository.getLinkedEntitiesSelector()).should('be.visible');
  }
}
