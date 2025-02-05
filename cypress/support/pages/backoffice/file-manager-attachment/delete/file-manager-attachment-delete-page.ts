import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';
import { FileManagerAttachmentDeleteRepository } from './file-manager-attachment-delete-repository';

@injectable()
@autoWired
export class FileManagerAttachmentDeletePage extends BackofficePage {
  @inject(FileManagerAttachmentDeleteRepository) private repository: FileManagerAttachmentDeleteRepository;

  confirmDelete(): void {
    cy.get(this.repository.getDeleteConfirmButtonSelector()).click();
  }

  verifySuccessMessage(): void {
    cy.get(this.repository.getSuccessMessageSelector())
      .should('be.visible')
      .and('contain', 'File was successfully removed.');
  }
}
