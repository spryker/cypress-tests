import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { FileManagerAttachmentDynamicFixtures, FileManagerAttachmentStaticFixtures } from '@interfaces/backoffice';
import {
  FileManagerAttachmentListPage,
  FileManagerAttachmentAddPage,
  FileManagerAttachmentViewPage,
  FileManagerAttachmentDeletePage,
  FileManagerAttachmentDetachPage,
  FileManagerAttachmentAttachPage,
} from '@pages/backoffice';

describeForSsp('File Manager Module - Files List', { tags: ['@backoffice', '@fileManager', '@ssp'] }, () => {
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

  it('should access the Files List page in Backoffice', () => {
    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.verifyListPage();
  });

  it('should successfully detach file from entity', () => {
    const fileManagerAttachmentDetachPage = container.get(FileManagerAttachmentDetachPage);

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickViewButton();

    fileManagerAttachmentDetachPage.detachFile();
    fileManagerAttachmentDetachPage.verifySuccessMessage();
  });

  it('should upload multiple files with size constraints', () => {
    const fileManagerAttachmentAddPage = container.get(FileManagerAttachmentAddPage);

    // Prepare test files that meet the constraints
    const testFiles: { fileContent: any; fileName: string; mimeType: string; filePath: string }[] = [];

    cy.fixture('suite/backoffice/file-manager-attachment/test-files/document1.pdf', 'binary')
      .then((fileContent) => {
        testFiles.push({
          fileContent,
          fileName: 'document1.pdf',
          mimeType: 'application/pdf',
          filePath: 'cypress/fixtures/suite/backoffice/file-manager-attachment/test-files/document1.pdf',
        });
      })
      .then(() => {
        cy.fixture('suite/backoffice/file-manager-attachment/test-files/image1.jpeg', 'binary');
      })
      .then((fileContent) => {
        testFiles.push({
          fileContent,
          fileName: 'image1.jpeg',
          mimeType: 'image/jpeg',
          filePath: 'cypress/fixtures/suite/backoffice/file-manager-attachment/test-files/image1.jpeg',
        });
      })
      .then(() => {
        cy.fixture('suite/backoffice/file-manager-attachment/test-files/image2.png', 'binary');
      })
      .then((fileContent) => {
        testFiles.push({
          fileContent,
          fileName: 'image2.png',
          mimeType: 'image/png',
          filePath: 'cypress/fixtures/suite/backoffice/file-manager-attachment/test-files/image2.png',
        });
      })
      .then(() => {
        cy.fixture('suite/backoffice/file-manager-attachment/test-files/document2.pdf', 'binary');
      })
      .then((fileContent) => {
        testFiles.push({
          fileContent,
          fileName: 'document2.pdf',
          mimeType: 'application/pdf',
          filePath: 'cypress/fixtures/suite/backoffice/file-manager-attachment/test-files/document2.pdf',
        });
      })
      .then(() => {
        fileManagerAttachmentAddPage.visit();
        fileManagerAttachmentAddPage.uploadFiles(testFiles);
        fileManagerAttachmentAddPage.verifyFileUploadConstraints();
        fileManagerAttachmentAddPage.submitForm();
        fileManagerAttachmentAddPage.verifySuccessMessage();
      });
  });

  it('should successfully delete a file', () => {
    const fileManagerAttachmentDeletePage = container.get(FileManagerAttachmentDeletePage);

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickDeleteButton();

    fileManagerAttachmentDeletePage.confirmDelete();
    fileManagerAttachmentDeletePage.verifySuccessMessage();
  });

  it('should display file details on view page', () => {
    const fileManagerAttachmentViewPage = container.get(FileManagerAttachmentViewPage);

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickViewButton();
    fileManagerAttachmentViewPage.verifyFileDetailsAreVisible();
  });

  it('should successfully attach file to multiple entities', () => {
    const fileManagerAttachmentAttachPage = container.get(FileManagerAttachmentAttachPage);

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickAttachButton();
    fileManagerAttachmentAttachPage.selectCompany('comp');
    fileManagerAttachmentAttachPage.selectCompanyUser('spen');
    fileManagerAttachmentAttachPage.selectCompanyBusinessUnit('unit');
    fileManagerAttachmentAttachPage.submitForm();
    fileManagerAttachmentAttachPage.verifySuccessMessage();
  });
});

function describeForSsp(title: string, options: { tags: string[] }, fn: () => void): void {
  (['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(title, fn);
}
