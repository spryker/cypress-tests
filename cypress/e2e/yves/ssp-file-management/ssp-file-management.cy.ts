import { container } from '@utils';
import { CustomerLoginScenario, CustomerLogoutScenario } from '@scenarios/yves';
import { CompanyUserSelectPage, CustomerOverviewPage } from '@pages/yves';
import { SspFileManagementDynamicFixtures } from '@interfaces/yves';
import { SspFileManagementListPage, SspAssetDetailPage, SspFileManagementDownloadPage } from '@pages/yves';
import { SspFileManagementStaticFixtures } from '@interfaces/yves';

describeForSsp('File Manager Module - Files List', { tags: ['@backoffice', '@fileManager', '@ssp'] }, () => {
  const customerLoginScenario = container.get(CustomerLoginScenario);
  const customerLogoutScenario = container.get(CustomerLogoutScenario);
  const customerOverviewPage = container.get(CustomerOverviewPage);
  const sspFileManagementListPage = container.get(SspFileManagementListPage);
  const sspAssetDetailPage = container.get(SspAssetDetailPage);
  const sspFileManagementDownloadPage = container.get(SspFileManagementDownloadPage);
  const companyUserSelectPage = container.get(CompanyUserSelectPage);

  let dynamicFixtures: SspFileManagementDynamicFixtures;
  let staticFixtures: SspFileManagementStaticFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  it('should access the My Files page from customer overview', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    customerOverviewPage.visit();
    customerOverviewPage.clickMyFilesLink();
    sspFileManagementListPage.verifyListPage();
  });

  it('should display uploaded files in the list', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    customerOverviewPage.visit();
    customerOverviewPage.clickMyFilesLink();
    sspFileManagementListPage.assertFileExists(dynamicFixtures.file1.file_name);
    sspFileManagementListPage.assertFileExists(dynamicFixtures.file2.file_name);

    sspAssetDetailPage.visit({
      qs: { reference: dynamicFixtures.sspAsset.reference },
    });

    sspFileManagementListPage.visit();
    sspFileManagementListPage.assertFileNotExists(dynamicFixtures.fileSspAsset.file_name);
  });

  it('should allow downloading a file according to permissions', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    customerOverviewPage.visit();
    customerOverviewPage.clickMyFilesLink();
    sspFileManagementListPage.downloadFile(dynamicFixtures.file1.file_name);
    sspFileManagementListPage.verifyFileDownloaded(dynamicFixtures.file1.file_name);

    sspFileManagementDownloadPage.downloadFile({ fileUuid: dynamicFixtures.fileSspAsset.uuid });

    customerLogoutScenario.execute();

    customerLoginScenario.execute({
      email: dynamicFixtures.customer2.email,
      password: staticFixtures.defaultPassword,
      withoutSession: true,
    });

    companyUserSelectPage.selectBusinessUnit({
      idCompanyUser: dynamicFixtures.companyUserBU1C2.id_company_user,
    });

    sspFileManagementDownloadPage.downloadFile({ fileUuid: dynamicFixtures.fileSspAsset.uuid });

    companyUserSelectPage.selectBusinessUnit({
      idCompanyUser: dynamicFixtures.companyUserBU2C2.id_company_user,
    });

    sspFileManagementDownloadPage.downloadFileForbidden({ fileUuid: dynamicFixtures.fileSspAsset.uuid });

    customerLogoutScenario.execute();

    customerLoginScenario.execute({
      email: dynamicFixtures.customer3.email,
      password: staticFixtures.defaultPassword,
      withoutSession: true,
    });

    sspFileManagementDownloadPage.downloadFileForbidden({ fileUuid: dynamicFixtures.fileSspAsset.uuid });

    customerLogoutScenario.execute();
  });

  it('should filter files by JPEG type', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
      withoutSession: true,
    });

    customerOverviewPage.visit();
    customerOverviewPage.clickMyFilesLink();
    sspFileManagementListPage.filterByType(staticFixtures.filter_value_jpeg);
    sspFileManagementListPage.assertFileExists(dynamicFixtures.file1.file_name);
    sspFileManagementListPage.assertFileNotExists(dynamicFixtures.file2.file_name);
  });

  it('should search for files by name', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
      withoutSession: true,
    });
    customerOverviewPage.visit();
    customerOverviewPage.clickMyFilesLink();

    sspFileManagementListPage.searchByName(dynamicFixtures.file1.file_name);
    sspFileManagementListPage.assertFileExists(dynamicFixtures.file1.file_name);
    sspFileManagementListPage.assertFileNotExists(dynamicFixtures.file2.file_name);

    sspFileManagementListPage.searchByName(dynamicFixtures.file2.file_name);
    sspFileManagementListPage.assertFileExists(dynamicFixtures.file2.file_name);
    sspFileManagementListPage.assertFileNotExists(dynamicFixtures.file1.file_name);

    sspFileManagementListPage.searchByName(staticFixtures.prompt_nonexistent);
    sspFileManagementListPage.assertNoResults();
  });

  it('should save filter and search settings during session', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
      withoutSession: true,
    });
    customerOverviewPage.visit();
    customerOverviewPage.clickMyFilesLink();

    sspFileManagementListPage.applyFilters(dynamicFixtures.file3.file_name, staticFixtures.filter_value_pdf);
    sspFileManagementListPage.assertFileExists(dynamicFixtures.file3.file_name);
    sspFileManagementListPage.assertFileNotExists(dynamicFixtures.file2.file_name);
    sspFileManagementListPage.assertFileNotExists(dynamicFixtures.file1.file_name);
  });
});

function describeForSsp(title: string, options: { tags: string[] }, fn: () => void): void {
  (['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(title, options, fn);
}
