import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { FileManagerAttachmentListRepository } from './file-manager-attachment-list-repository';

@injectable()
@autoWired
export class FileManagerAttachmentListPage extends YvesPage {
    @inject(FileManagerAttachmentListRepository) private repository: FileManagerAttachmentListRepository;

    protected PAGE_URL = '/customer/files';

    verifyListPage(): void {
        cy.get(this.repository.getFitersSelector()).should('be.visible');
    }

    assertFileExists(fileName: string): void {
        cy.get(this.repository.getFileTableSelector())
            .find('tr')
            .contains(fileName)
            .should('be.visible');
    }

    downloadFile(fileName: string): void {
        cy.get(this.repository.getFileTableSelector())
            .find('tr')
            .contains(fileName)
            .parent()
            .find(this.repository.getDownloadButtonSelector())
            .click();
    }

    verifyFileDownloaded(fileName: string): void {
        cy.readFile(Cypress.config('downloadsFolder') + '/' + fileName).should('exist');
    }
}
