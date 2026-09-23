import { container } from '@utils';
import { retryableBefore } from '../../../support/e2e';
import { CustomerLoginScenario, CustomerLogoutScenario } from '@scenarios/yves';
import { CompanyUserSelectPage, CustomerOverviewPage } from '@pages/yves';
import { SspFileManagementDynamicFixtures } from '@interfaces/yves';
import { SspFileManagementListPage, SspAssetDetailPage, SspFileManagementDownloadPage } from '@pages/yves';
import { SspFileManagementStaticFixtures } from '@interfaces/yves';

describe(
  'File Manager Module - Files List',
  { tags: ['@backoffice', '@fileManager', '@ssp', 'ssp-file-management', 'self-service-portal', 'spryker-core'] },
  () => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b-mp', () => {});
      return;
    }
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerLogoutScenario = container.get(CustomerLogoutScenario);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const sspFileManagementListPage = container.get(SspFileManagementListPage);
    const sspAssetDetailPage = container.get(SspAssetDetailPage);
    const sspFileManagementDownloadPage = container.get(SspFileManagementDownloadPage);
    const companyUserSelectPage = container.get(CompanyUserSelectPage);

    let dynamicFixtures: SspFileManagementDynamicFixtures;
    let staticFixtures: SspFileManagementStaticFixtures;

    retryableBefore((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    it('should access the My Files page from customer overview', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      customerOverviewPage.visit();
      customerOverviewPage.clickMyFilesLink();

      if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
        sspFileManagementListPage.openFilters();
      }

      sspFileManagementListPage.getFileTable().should('be.visible');
    });

    it('should display uploaded files in the list', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      customerOverviewPage.visit();
      customerOverviewPage.clickMyFilesLink();
      sspFileManagementListPage.getFileRow(dynamicFixtures.file1.file_name).should('be.visible');
      sspFileManagementListPage.getFileRow(dynamicFixtures.file2.file_name).should('be.visible');

      sspAssetDetailPage.visit({
        qs: { reference: dynamicFixtures.sspAssetBU1C2.reference },
      });

      sspFileManagementListPage.visit();
      sspFileManagementListPage.getFileRow(dynamicFixtures.fileSspAsset1.file_name).should('be.visible');
    });

    it('should allow downloading a file according to permissions', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      customerOverviewPage.visit();
      customerOverviewPage.clickMyFilesLink();
      sspFileManagementListPage.downloadFile(dynamicFixtures.file1.file_name);
      sspFileManagementListPage.getDownloadedFile(dynamicFixtures.file1.file_name).should('exist');

      sspFileManagementDownloadPage.downloadFile({ fileUuid: dynamicFixtures.fileSspAsset1.uuid }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.exist;
      });

      customerLogoutScenario.execute();

      customerLoginScenario.execute({
        email: dynamicFixtures.customer2.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUserBU1C2.id_company_user,
      });

      sspFileManagementDownloadPage.downloadFile({ fileUuid: dynamicFixtures.fileSspAsset1.uuid }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.exist;
      });

      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUserBU2C2.id_company_user,
      });

      sspFileManagementDownloadPage
        .downloadFileForbidden({ fileUuid: dynamicFixtures.fileSspAsset1.uuid })
        .then((response) => {
          expect(response.status).to.eq(200);

          const redirectUrl =
            response.allRequestResponses?.[response.allRequestResponses.length - 1]?.['Request URL'] || '';
          expect(redirectUrl).to.include('/error-page/404');
        });

      customerLogoutScenario.execute();

      customerLoginScenario.execute({
        email: dynamicFixtures.customer3.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      sspFileManagementDownloadPage
        .downloadFileForbidden({ fileUuid: dynamicFixtures.fileSspAsset1.uuid })
        .then((response) => {
          expect(response.status).to.eq(200);

          const redirectUrl =
            response.allRequestResponses?.[response.allRequestResponses.length - 1]?.['Request URL'] || '';
          expect(redirectUrl).to.include('/error-page/404');
        });

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
      if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
        sspFileManagementListPage.openFilters();
      }
      sspFileManagementListPage.filterByType(staticFixtures.filter_value_jpeg);
      sspFileManagementListPage.getFileRow(dynamicFixtures.file1.file_name).should('be.visible');
      sspFileManagementListPage.getFileRow(dynamicFixtures.file2.file_name).should('not.exist');
    });

    it('should search for files by name', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });
      customerOverviewPage.visit();
      customerOverviewPage.clickMyFilesLink();

      if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
        sspFileManagementListPage.openFilters();
      }

      sspFileManagementListPage.searchByName(dynamicFixtures.file1.file_name);
      sspFileManagementListPage.getFileRow(dynamicFixtures.file1.file_name).should('be.visible');
      sspFileManagementListPage.getFileRow(dynamicFixtures.file2.file_name).should('not.exist');

      if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
        sspFileManagementListPage.openFilters();
      }

      sspFileManagementListPage.searchByName(dynamicFixtures.file2.file_name);
      sspFileManagementListPage.getFileRow(dynamicFixtures.file2.file_name).should('be.visible');
      sspFileManagementListPage.getFileRow(dynamicFixtures.file1.file_name).should('not.exist');

      if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
        sspFileManagementListPage.openFilters();
      }

      sspFileManagementListPage.searchByName(staticFixtures.prompt_nonexistent);
      sspFileManagementListPage.getFileRows().should('not.exist');
    });

    it('should save filter and search settings during session', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });
      customerOverviewPage.visit();
      customerOverviewPage.clickMyFilesLink();

      if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
        sspFileManagementListPage.openFilters();
      }

      sspFileManagementListPage.applyFilterByTypeAndSearchTerm(
        dynamicFixtures.file3.file_name,
        staticFixtures.filter_value_pdf
      );
      sspFileManagementListPage.getFileRow(dynamicFixtures.file3.file_name).should('be.visible');
      sspFileManagementListPage.getFileRow(dynamicFixtures.file2.file_name).should('not.exist');
      sspFileManagementListPage.getFileRow(dynamicFixtures.file1.file_name).should('not.exist');
    });

    it('should filter files by business entity', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      customerOverviewPage.visit();
      customerOverviewPage.clickMyFilesLink();

      if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
        sspFileManagementListPage.openFilters();
      }

      sspFileManagementListPage.getFileTable().should('be.visible');

      sspFileManagementListPage.filterByBusinessEntity('all');
      sspFileManagementListPage.filterBySspAssetEntity('all');
      sspFileManagementListPage.applyFilters();
      sspFileManagementListPage.getFileRow(dynamicFixtures.file1.file_name).should('be.visible');
      sspFileManagementListPage.getFileRow(dynamicFixtures.file2.file_name).should('be.visible');
      sspFileManagementListPage.getFileRow(dynamicFixtures.file3.file_name).should('be.visible');
      sspFileManagementListPage.getFileRow(dynamicFixtures.fileSspAsset1.file_name).should('be.visible');

      if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
        sspFileManagementListPage.openFilters();
      }

      sspFileManagementListPage.filterByBusinessEntity('company_user');
      sspFileManagementListPage.filterBySspAssetEntity('all');
      sspFileManagementListPage.applyFilters();

      sspFileManagementListPage.getFileRow(dynamicFixtures.file1.file_name).should('be.visible');
      sspFileManagementListPage.getFileRow(dynamicFixtures.file2.file_name).should('be.visible');
      sspFileManagementListPage.getFileRow(dynamicFixtures.file3.file_name).should('not.exist');
      sspFileManagementListPage.getFileRow(dynamicFixtures.fileSspAsset1.file_name).should('be.visible');

      if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
        sspFileManagementListPage.openFilters();
      }

      sspFileManagementListPage.filterByBusinessEntity('company');
      sspFileManagementListPage.filterBySspAssetEntity('none');
      sspFileManagementListPage.applyFilters();
      sspFileManagementListPage.getFileRow(dynamicFixtures.file1.file_name).should('be.visible');
      sspFileManagementListPage.getFileRow(dynamicFixtures.file2.file_name).should('be.visible');
      sspFileManagementListPage.getFileRow(dynamicFixtures.file3.file_name).should('be.visible');
      sspFileManagementListPage.getFileRow(dynamicFixtures.fileSspAsset1.file_name).should('not.exist');

      if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
        sspFileManagementListPage.openFilters();
      }

      sspFileManagementListPage.filterByBusinessEntity('none');
      sspFileManagementListPage.filterBySspAssetEntity('all');
      sspFileManagementListPage.applyFilters();
      sspFileManagementListPage.getFileRow(dynamicFixtures.file1.file_name).should('not.exist');
      sspFileManagementListPage.getFileRow(dynamicFixtures.file2.file_name).should('not.exist');
      sspFileManagementListPage.getFileRow(dynamicFixtures.file3.file_name).should('not.exist');
      sspFileManagementListPage.getFileRow(dynamicFixtures.fileSspAsset1.file_name).should('be.visible');

      if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
        sspFileManagementListPage.openFilters();
      }

      sspFileManagementListPage.filterByBusinessEntity(dynamicFixtures.businessUnit2C1.uuid.toString());
      sspFileManagementListPage.filterBySspAssetEntity('none');
      sspFileManagementListPage.applyFilters();
      sspFileManagementListPage.getFileRow(dynamicFixtures.file1.file_name).should('be.visible');
      sspFileManagementListPage.getFileRow(dynamicFixtures.file2.file_name).should('be.visible');
      sspFileManagementListPage.getFileRow(dynamicFixtures.file3.file_name).should('not.exist');
      sspFileManagementListPage.getFileRow(dynamicFixtures.fileSspAsset1.file_name).should('not.exist');

      if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
        sspFileManagementListPage.openFilters();
      }

      sspFileManagementListPage.filterByBusinessEntity('none');
      sspFileManagementListPage.filterBySspAssetEntity('all');
      sspFileManagementListPage.applyFilters();
      sspFileManagementListPage.getFileRow(dynamicFixtures.file1.file_name).should('not.exist');
      sspFileManagementListPage.getFileRow(dynamicFixtures.file2.file_name).should('not.exist');
      sspFileManagementListPage.getFileRow(dynamicFixtures.file3.file_name).should('not.exist');
      sspFileManagementListPage.getFileRow(dynamicFixtures.fileSspAsset1.file_name).should('be.visible');
      sspFileManagementListPage.getFileRow(dynamicFixtures.fileSspAsset2.file_name).should('not.exist');
    });
  }
);
