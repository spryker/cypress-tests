import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { FileManagerAttachmentDynamicFixtures, FileManagerAttachmentStaticFixtures } from '@interfaces/backoffice';
import { FileManagerAttachmentListPage } from '@pages/backoffice';

describe('File Manager Module - Files List', () => {
    const userLoginScenario = container.get(UserLoginScenario);
    const fileManagerAttachmentListPage = container.get(FileManagerAttachmentListPage);
    
    let dynamicFixtures: FileManagerAttachmentDynamicFixtures;
    let staticFixtures: FileManagerAttachmentStaticFixtures;

    before((): void => {
        ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach(() => {
        userLoginScenario.execute({
            username: dynamicFixtures.rootUser.username,
            password: staticFixtures.defaultPassword,
        });
    });

    it.skip('should access the Files List page in Backoffice', () => {
        fileManagerAttachmentListPage.visit();
        fileManagerAttachmentListPage.verifyListPage();
    });

    it('should upload multiple files with size constraints', () => {
        fileManagerAttachmentListPage.visit();
        
        
        // Prepare test files that meet the constraints
        const testFiles: { fileContent: any; fileName: string; mimeType: string; }[] = [];
        
        cy.fixture('test-files/document1.pdf', 'binary').then((fileContent) => {
            testFiles.push({ fileContent, fileName: 'document1.pdf', mimeType: 'application/pdf' });
        });
        
        cy.fixture('test-files/image1.jpg', 'binary').then((fileContent) => {
            testFiles.push({ fileContent, fileName: 'image1.jpg', mimeType: 'image/jpeg' });
        });
        
        cy.fixture('test-files/image2.png', 'binary').then((fileContent) => {
            testFiles.push({ fileContent, fileName: 'image2.png', mimeType: 'image/png' });
        });
        
        cy.fixture('test-files/document2.pdf', 'binary').then((fileContent) => {
            testFiles.push({ fileContent, fileName: 'document2.pdf', mimeType: 'application/pdf' });
        });

        // Click on upload button
        cy.get('[data-qa="file-upload-button"]').click();

        // Upload files
        cy.get(`input[name="${UploadFileForm.FIELD_FILE_UPLOAD}"]`).selectFile(
            testFiles.map(file => file.fileContent),
            {
                force: true,
                action: 'select'
            }
        );

        // Verify file upload constraints
        cy.get(`input[name="${UploadFileForm.FIELD_FILE_UPLOAD}"]`)
            .should('have.attr', 'multiple')
            .and('have.attr', 'max', '4');

        // Submit the form
        cy.get('[data-qa="file-upload-submit"]').click();

        // Verify success message
        cy.get('[data-qa="flash-message-successful"]').should('be.visible');

        // Verify uploaded files appear in the list
        testFiles.forEach(file => {
            cy.get('[data-qa="file-list"]')
                .should('contain', file.fileName);
        });
    });
});
