import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { SspFileManagementDynamicFixtures, SspFileManagementStaticFixtures } from '@interfaces/backoffice';
import {
  SspFileManagementListPage,
  SspFileManagementAddPage,
  SspFileManagementViewPage,
  SspFileManagementDeletePage,
  SspFileManagementDetachPage,
  SspFileManagementAttachPage,
} from '@pages/backoffice';

describeForSsp('File Manager Module - Files List', { tags: ['@backoffice', '@fileManager', '@ssp'] }, () => {
  const userLoginScenario = container.get(UserLoginScenario);
  const fileManagerAttachmentListPage = container.get(SspFileManagementListPage);
  const fileManagerAttachmentAddPage = container.get(SspFileManagementAddPage);

  let dynamicFixtures: SspFileManagementDynamicFixtures;
  let staticFixtures: SspFileManagementStaticFixtures;

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

  it('should upload multiple files with size constraints', () => {
    fileManagerAttachmentAddPage.visit();
    fileManagerAttachmentAddPage.verifyFileUploadConstraints();

    fileManagerAttachmentAddPage.loadTestFiles().then((files) => {
      fileManagerAttachmentAddPage.uploadFiles(files);
      fileManagerAttachmentAddPage.submitForm();
      fileManagerAttachmentAddPage.verifySuccessMessage();
    });
  });

  it('should successfully delete a file', () => {
    const fileManagerAttachmentDeletePage = container.get(SspFileManagementDeletePage);

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickDeleteButton();

    fileManagerAttachmentDeletePage.confirmDelete();
    fileManagerAttachmentDeletePage.verifySuccessMessage();
    fileManagerAttachmentDeletePage.assertDeleteFile();
  });

  it('should display file details on view page', () => {
    const fileManagerAttachmentViewPage = container.get(SspFileManagementViewPage);

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickViewButton();
    fileManagerAttachmentViewPage.verifyFileDetailsAreVisible();
  });

  it('should successfully attach file to a company manually', () => {
    const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickAttachButton();

    fileManagerAttachmentAttachPage.selectAttachmentScope('company');
    fileManagerAttachmentAttachPage.selectAvailableItems('company', [dynamicFixtures.company1.name]);
    fileManagerAttachmentAttachPage.submitForm();
    fileManagerAttachmentAttachPage.verifySuccessMessage();
  });

  it('should successfully attach file to a business unit manually', () => {
    const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickAttachButton();

    fileManagerAttachmentAttachPage.selectAttachmentScope('business-unit');
    fileManagerAttachmentAttachPage.selectAvailableItems('business-unit', [dynamicFixtures.businessUnit.name]);
    fileManagerAttachmentAttachPage.submitForm();
    fileManagerAttachmentAttachPage.verifySuccessMessage();
  });

  it('should successfully attach file to a company user manually', () => {
    const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickAttachButton();

    fileManagerAttachmentAttachPage.selectAttachmentScope('company-user');
    fileManagerAttachmentAttachPage.selectAvailableItems('company-user', [
      dynamicFixtures.companyUser.customer.first_name,
    ]);
    fileManagerAttachmentAttachPage.submitForm();
    fileManagerAttachmentAttachPage.verifySuccessMessage();
  });

  it('should successfully attach file to an asset', () => {
    const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickAttachButton();

    fileManagerAttachmentAttachPage.selectAvailableItems('asset', [dynamicFixtures.sspAsset.name]);
    fileManagerAttachmentAttachPage.submitForm();
    fileManagerAttachmentAttachPage.verifySuccessMessage();
  });

  it('should successfully attach assets via CSV import', () => {
    const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickAttachButton();

    fileManagerAttachmentAttachPage.uploadCsvFile('asset', 'csv/assets-example.csv');
    fileManagerAttachmentAttachPage.submitForm();
    fileManagerAttachmentAttachPage.verifySuccessMessage();
  });

  it('should successfully attach business units via CSV import', () => {
    const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickAttachButton();

    fileManagerAttachmentAttachPage.selectAttachmentScope('business-unit');

    fileManagerAttachmentAttachPage.uploadCsvFile('business-unit', 'csv/business-units-example.csv');
    fileManagerAttachmentAttachPage.submitForm();
    fileManagerAttachmentAttachPage.verifySuccessMessage();
  });

  it('should successfully attach company users via CSV import', () => {
    const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickAttachButton();

    fileManagerAttachmentAttachPage.selectAttachmentScope('company-user');

    fileManagerAttachmentAttachPage.uploadCsvFile('company-user', 'csv/company-users-example.csv');
    fileManagerAttachmentAttachPage.submitForm();
    fileManagerAttachmentAttachPage.verifySuccessMessage();
  });

  it('should successfully attach companies via CSV import', () => {
    const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickAttachButton();

    fileManagerAttachmentAttachPage.selectAttachmentScope('company');

    fileManagerAttachmentAttachPage.uploadCsvFile('company', 'csv/companies-example.csv');
    fileManagerAttachmentAttachPage.submitForm();
    fileManagerAttachmentAttachPage.verifySuccessMessage();
  });

  it('should successfully detach file from an asset', () => {
    const fileManagerAttachmentDetachPage = container.get(SspFileManagementDetachPage);

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickViewButton();

    fileManagerAttachmentDetachPage.detachFile();
    fileManagerAttachmentDetachPage.verifySuccessMessage();
    fileManagerAttachmentDetachPage.assertDetachFile();
  });

  it('should successfully detach file from entity', () => {
    const fileManagerAttachmentDetachPage = container.get(SspFileManagementDetachPage);
    const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickAttachButton();

    fileManagerAttachmentAttachPage.selectAvailableItems('asset', [dynamicFixtures.sspAsset.name]);
    fileManagerAttachmentAttachPage.submitForm();

    fileManagerAttachmentListPage.visit();
    fileManagerAttachmentListPage.clickViewButton();

    fileManagerAttachmentDetachPage.detachFile();
    fileManagerAttachmentDetachPage.verifySuccessMessage();
    fileManagerAttachmentDetachPage.assertDetachFile();
  });
});

function describeForSsp(title: string, options: { tags: string[] }, fn: () => void): void {
  (['suite', 'b2b'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(title, options, fn);
}
