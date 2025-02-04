import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';
import { FileManagerAttachmentViewRepository } from './file-manager-attachment-view-repository';

@injectable()
@autoWired
export class FileManagerAttachmentViewPage extends BackofficePage {
    @inject(FileManagerAttachmentViewRepository) private repository: FileManagerAttachmentViewRepository;

    verifyFileDetailsAreVisible(): void {
        cy.get(this.repository.getFileNameSelector()).should('be.visible');
        cy.get(this.repository.getUploadedDateSelector()).should('be.visible');
        cy.get(this.repository.getFileSizeSelector()).should('be.visible');
        cy.get(this.repository.getFileTypeSelector()).should('be.visible');
        cy.get(this.repository.getLinkedEntitiesSelector()).should('be.visible');
    }
}
