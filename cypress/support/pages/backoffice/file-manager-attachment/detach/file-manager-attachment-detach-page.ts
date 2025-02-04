import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';
import { FileManagerAttachmentDetachRepository } from './file-manager-attachment-detach-repository';

@injectable()
@autoWired
export class FileManagerAttachmentDetachPage extends BackofficePage {
    @inject(FileManagerAttachmentDetachRepository) private repository: FileManagerAttachmentDetachRepository;

    detachFile(): void {
        cy.get(this.repository.getDetachButtonSelector()).click();
    }

    verifySuccessMessage(): void {
        cy.get(this.repository.getSuccessMessageSelector())
            .should('be.visible')
            .and('contain', 'File attachment successfully unlinked.');
    }
}
