import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { FileManagerAttachmentListRepository } from './file-manager-attachment-list-repository';

@injectable()
@autoWired
export class FileManagerAttachmentListPage extends BackofficePage {
    @inject(FileManagerAttachmentListRepository) private repository: FileManagerAttachmentListRepository;

    protected PAGE_URL = '/file-manager-attachment/list';

    verifyListPage(): void {
        cy.get(this.repository.getTableHeaderSelector()).should('contain', 'Reference');
        cy.get(this.repository.getTableHeaderSelector()).should('contain', 'File Name');
        cy.get(this.repository.getTableHeaderSelector()).should('contain', 'Size');
        cy.get(this.repository.getTableHeaderSelector()).should('contain', 'Type');
        cy.get(this.repository.getTableHeaderSelector()).should('contain', 'Date Uploaded');
        cy.get(this.repository.getTableHeaderSelector()).should('contain', 'Actions');
    }

    clickViewButton(): void {
        cy.get(this.repository.getViewButtonSelector()).first().click();
    }
}
