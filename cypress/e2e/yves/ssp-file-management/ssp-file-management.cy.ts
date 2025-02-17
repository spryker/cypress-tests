import { container } from '@utils';
import { CustomerLoginScenario } from '@scenarios/yves';
import { CustomerOverviewPage } from '@pages/yves';
import { SspFileManagementDynamicFixtures } from '@interfaces/yves';
import { SspFileManagementListPage } from '@pages/yves';
import { SspFileManagementStaticFixtures } from '@interfaces/yves';

describeForSsp('File Manager Module - Files List', { tags: ['@backoffice', '@fileManager', '@ssp'] }, () => {
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const sspFileManagementListPage = container.get(SspFileManagementListPage);

    let dynamicFixtures: SspFileManagementDynamicFixtures;
    let staticFixtures: SspFileManagementStaticFixtures;

    before((): void => {
        ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
        customerLoginScenario.execute({
            email: dynamicFixtures.customer.email,
            password: staticFixtures.defaultPassword,
        });
    });

    it('should access the My Files page from customer overview', (): void => {
        customerOverviewPage.visit();
        customerOverviewPage.clickMyFilesLink();
        sspFileManagementListPage.verifyListPage();
    });

    it('should display uploaded files in the list', (): void => {
        customerOverviewPage.visit();
        customerOverviewPage.clickMyFilesLink();
        sspFileManagementListPage.assertFileExists(dynamicFixtures.file1.file_name);
        sspFileManagementListPage.assertFileExists(dynamicFixtures.file2.file_name);
    });

    it('should allow downloading a file', (): void => {
        customerOverviewPage.visit();
        customerOverviewPage.clickMyFilesLink();
        sspFileManagementListPage.downloadFile(dynamicFixtures.file1.file_name);
        sspFileManagementListPage.verifyFileDownloaded(dynamicFixtures.file1.file_info[0].storage_file_name);
    });

    it('should filter files by JPEG type', (): void => {
        customerOverviewPage.visit();
        customerOverviewPage.clickMyFilesLink();
        sspFileManagementListPage.filterByType(staticFixtures.filter_value_jpeg);
        sspFileManagementListPage.assertFileExists(dynamicFixtures.file1.file_name);
        sspFileManagementListPage.assertFileNotExists(dynamicFixtures.file2.file_name);
    });

    it('should search for files by name', (): void => {
        customerOverviewPage.visit();
        customerOverviewPage.clickMyFilesLink();

        sspFileManagementListPage.searchByName(staticFixtures.prompt_img);
        sspFileManagementListPage.assertFileExists(dynamicFixtures.file1.file_name);
        sspFileManagementListPage.assertFileNotExists(dynamicFixtures.file2.file_name);

        sspFileManagementListPage.searchByName(staticFixtures.prompt_doc);
        sspFileManagementListPage.assertFileExists(dynamicFixtures.file2.file_name);
        sspFileManagementListPage.assertFileNotExists(dynamicFixtures.file1.file_name);

        sspFileManagementListPage.searchByName(staticFixtures.prompt_nonexistent);
        sspFileManagementListPage.assertNoResults();
    });

    it('should save filter and search settings during session', (): void => {
        customerOverviewPage.visit();
        customerOverviewPage.clickMyFilesLink();

        sspFileManagementListPage.applyFilters(staticFixtures.filter_type_file, staticFixtures.filter_value_pdf);
        sspFileManagementListPage.assertFileExists(dynamicFixtures.file3.file_name);
        sspFileManagementListPage.assertFileNotExists(dynamicFixtures.file2.file_name);
        sspFileManagementListPage.assertFileNotExists(dynamicFixtures.file1.file_name);
    });
    }
);

function describeForSsp(title: string, options: { tags: string[] }, fn: () => void): void {
    (['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(title, fn);
}
