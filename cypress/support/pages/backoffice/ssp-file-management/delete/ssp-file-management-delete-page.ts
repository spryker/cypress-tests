import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';
import { SspFileManagementDeleteRepository } from './ssp-file-management-delete-repository';

@injectable()
@autoWired
export class SspFileManagementDeletePage extends BackofficePage {
  @inject(SspFileManagementDeleteRepository) private repository: SspFileManagementDeleteRepository;

  confirmDelete(): void {
    cy.get(this.repository.getDeleteConfirmButtonSelector()).click();
  }

  verifySuccessMessage(): void {
    cy.get(this.repository.getSuccessMessageSelector())
      .should('be.visible')
      .and('contain', 'File was successfully removed.');
  }

  assertDeleteFile(): void {
    this.repository.getFileTableRows().should('have.length', 0);
  }
}
