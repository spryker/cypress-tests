import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { FileManagerAttachmentDynamicFixtures, FileManagerAttachmentStaticFixtures } from '@interfaces/backoffice';
import { FileManagerAttachmentListPage, FileManagerAttachmentAddPage, FileManagerAttachmentViewPage } from '@pages/backoffice';

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

    it.skip('should upload multiple files with size constraints', () => {
        const fileManagerAttachmentAddPage = container.get(FileManagerAttachmentAddPage);
        
        // Prepare test files that meet the constraints
        const testFiles: { fileContent: any; fileName: string; mimeType: string; filePath: string; }[] = [];
        
        cy.fixture('suite/backoffice/file-manager-attachment/test-files/document1.pdf', 'binary').then((fileContent) => {
            testFiles.push({ fileContent, fileName: 'document1.pdf', mimeType: 'application/pdf', filePath: 'cypress/fixtures/suite/backoffice/file-manager-attachment/test-files/document1.pdf' });
        }).then(() => {
            cy.fixture('suite/backoffice/file-manager-attachment/test-files/image1.jpeg', 'binary');
        }).then((fileContent) => {
            testFiles.push({ fileContent, fileName: 'image1.jpeg', mimeType: 'image/jpeg', filePath: 'cypress/fixtures/suite/backoffice/file-manager-attachment/test-files/image1.jpeg' });
        }).then(() => {
            cy.fixture('suite/backoffice/file-manager-attachment/test-files/image2.png', 'binary');
        }).then((fileContent) => {
            testFiles.push({ fileContent, fileName: 'image2.png', mimeType: 'image/png', filePath: 'cypress/fixtures/suite/backoffice/file-manager-attachment/test-files/image2.png' });
        }).then(() => {
            cy.fixture('suite/backoffice/file-manager-attachment/test-files/document2.pdf', 'binary');
        }).then((fileContent) => {
            testFiles.push({ fileContent, fileName: 'document2.pdf', mimeType: 'application/pdf', filePath: 'cypress/fixtures/suite/backoffice/file-manager-attachment/test-files/document2.pdf' });
        }).then(() => {
            fileManagerAttachmentAddPage.visit();
            fileManagerAttachmentAddPage.uploadFiles(testFiles);
            fileManagerAttachmentAddPage.verifyFileUploadConstraints();
            fileManagerAttachmentAddPage.submitForm();
            fileManagerAttachmentAddPage.verifySuccessMessage();
        });
    });

    it('should display file details on view page', () => {
        const fileManagerAttachmentViewPage = container.get(FileManagerAttachmentViewPage);

        fileManagerAttachmentListPage.visit();
        fileManagerAttachmentListPage.clickViewButton();
        fileManagerAttachmentViewPage.verifyFileDetails();
    });
});
