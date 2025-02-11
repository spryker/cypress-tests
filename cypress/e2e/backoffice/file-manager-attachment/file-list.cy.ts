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
  const fileManagerAttachmentAddPage = container.get(FileManagerAttachmentAddPage);

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
    fileManagerAttachmentDetachPage.assertDetachFile();
  });

  it('should upload multiple files with size constraints', () => {
    const testFiles: Array<{ fileContent: any; fileName: string; mimeType: string; filePath: string }> = [];

    fileManagerAttachmentAddPage.visit();
    fileManagerAttachmentAddPage.verifyFileUploadConstraints();

    fileManagerAttachmentAddPage.loadTestFiles().then((files) => {
      fileManagerAttachmentAddPage.uploadFiles(files);
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
    fileManagerAttachmentDeletePage.assertDeleteFile();
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
    fileManagerAttachmentAttachPage.selectCompany();
    fileManagerAttachmentAttachPage.selectCompanyUser();
    fileManagerAttachmentAttachPage.selectCompanyBusinessUnit();
    fileManagerAttachmentAttachPage.submitForm();
    fileManagerAttachmentAttachPage.verifySuccessMessage();
  });
});

function describeForSsp(title: string, options: { tags: string[] }, fn: () => void): void {
  (['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(title, fn);
}
