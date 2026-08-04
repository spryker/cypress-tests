import { container } from '@utils';
import { retryableBefore } from '../../../support/e2e';
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

describe(
  'File Manager Module - Files List',
  {
    tags: [
      '@backoffice',
      '@fileManager',
      '@ssp',
      'ssp-file-management',
      'self-service-portal',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  () => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b-mp', () => {});
      return;
    }
    const userLoginScenario = container.get(UserLoginScenario);
    const fileManagerAttachmentListPage = container.get(SspFileManagementListPage);
    const fileManagerAttachmentAddPage = container.get(SspFileManagementAddPage);

    let dynamicFixtures: SspFileManagementDynamicFixtures;
    let staticFixtures: SspFileManagementStaticFixtures;

    retryableBefore((): void => {
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
      fileManagerAttachmentListPage.getReferenceHeader().should('contain', 'Reference');
      fileManagerAttachmentListPage.getFileNameHeader().should('contain', 'File Name');
      fileManagerAttachmentListPage.getFileSizeHeader().should('contain', 'Size');
      fileManagerAttachmentListPage.getFileTypeHeader().should('contain', 'Type');
      fileManagerAttachmentListPage.getUploadedDateHeader().should('contain', 'Date Uploaded');
    });

    it('should upload multiple files with size constraints', () => {
      fileManagerAttachmentAddPage.visit();
      fileManagerAttachmentAddPage.getFileInput().should('have.attr', 'multiple');
      fileManagerAttachmentAddPage.getFileInput().should('have.attr', 'accept', '.pdf,.jpeg,.jpg,.png,.heic,.heif');
      fileManagerAttachmentAddPage.getFileInput().should('have.attr', 'size', '100M');
      fileManagerAttachmentAddPage.getFileInput().should('have.attr', 'max', '4');

      fileManagerAttachmentAddPage.loadTestFiles().then((files) => {
        fileManagerAttachmentAddPage.uploadFiles(files);
        fileManagerAttachmentAddPage.submitForm();
        fileManagerAttachmentAddPage.getSuccessMessage().should('be.visible');
      });
    });

    it('should successfully delete a file', () => {
      const fileManagerAttachmentDeletePage = container.get(SspFileManagementDeletePage);

      fileManagerAttachmentListPage.visit();
      fileManagerAttachmentListPage.clickDeleteButton();

      fileManagerAttachmentDeletePage.confirmDelete();
      fileManagerAttachmentDeletePage
        .getSuccessMessage()
        .should('be.visible')
        .and('contain', 'File was successfully removed.');
      fileManagerAttachmentDeletePage
        .getFileTableRows()
        .first()
        .should(($row) => {
          const hasEmptyState = $row.find(fileManagerAttachmentDeletePage.getEmptyRowSelector()).length > 0;
          const hasNoRows = $row.length === 0;

          expect(hasEmptyState || hasNoRows).to.be.true;
        });
    });

    it('should display file details on view page', () => {
      const fileManagerAttachmentViewPage = container.get(SspFileManagementViewPage);

      fileManagerAttachmentListPage.visit();
      fileManagerAttachmentListPage.clickViewButton();
      fileManagerAttachmentViewPage.getFileName().should('be.visible');
      fileManagerAttachmentViewPage.getUploadedDate().should('be.visible');
      fileManagerAttachmentViewPage.getFileSize().should('be.visible');
      fileManagerAttachmentViewPage.getFileType().should('be.visible');
      fileManagerAttachmentViewPage.getLinkedEntities().should('be.visible');
    });

    it('should successfully attach file to a company manually', () => {
      const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

      fileManagerAttachmentListPage.visit();
      fileManagerAttachmentListPage.clickAttachButton();

      fileManagerAttachmentAttachPage.selectAttachmentScope('company');
      fileManagerAttachmentAttachPage.searchUnattachedItem('company', dynamicFixtures.company1.name);
      fileManagerAttachmentAttachPage.getUnattachedProcessingOverlay('company').should('not.be.visible');
      fileManagerAttachmentAttachPage
        .getFirstUnattachedRow('company')
        .should('contain', dynamicFixtures.company1.name)
        .find(fileManagerAttachmentAttachPage.getTableRowCheckboxSelector(), { timeout: 10000 })
        .check({ force: true });
      fileManagerAttachmentAttachPage.submitForm();
      fileManagerAttachmentAttachPage
        .getSuccessMessage()
        .should('be.visible')
        .and('contain', fileManagerAttachmentAttachPage.getFileAttachmentSuccessText());
    });

    it('should successfully attach file to a business unit manually', () => {
      const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

      fileManagerAttachmentListPage.visit();
      fileManagerAttachmentListPage.clickAttachButton();

      fileManagerAttachmentAttachPage.selectAttachmentScope('business-unit');
      fileManagerAttachmentAttachPage.searchUnattachedItem('business-unit', dynamicFixtures.businessUnit.name);
      fileManagerAttachmentAttachPage.getUnattachedProcessingOverlay('business-unit').should('not.be.visible');
      fileManagerAttachmentAttachPage
        .getFirstUnattachedRow('business-unit')
        .should('contain', dynamicFixtures.businessUnit.name)
        .find(fileManagerAttachmentAttachPage.getTableRowCheckboxSelector(), { timeout: 10000 })
        .check({ force: true });
      fileManagerAttachmentAttachPage.submitForm();
      fileManagerAttachmentAttachPage
        .getSuccessMessage()
        .should('be.visible')
        .and('contain', fileManagerAttachmentAttachPage.getFileAttachmentSuccessText());
    });

    it('should successfully attach file to a company user manually', () => {
      const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

      fileManagerAttachmentListPage.visit();
      fileManagerAttachmentListPage.clickAttachButton();

      fileManagerAttachmentAttachPage.selectAttachmentScope('company-user');
      fileManagerAttachmentAttachPage.searchUnattachedItem(
        'company-user',
        dynamicFixtures.companyUser.customer.first_name
      );
      fileManagerAttachmentAttachPage.getUnattachedProcessingOverlay('company-user').should('not.be.visible');
      fileManagerAttachmentAttachPage
        .getFirstUnattachedRow('company-user')
        .should('contain', dynamicFixtures.companyUser.customer.first_name)
        .find(fileManagerAttachmentAttachPage.getTableRowCheckboxSelector(), { timeout: 10000 })
        .check({ force: true });
      fileManagerAttachmentAttachPage.submitForm();
      fileManagerAttachmentAttachPage
        .getSuccessMessage()
        .should('be.visible')
        .and('contain', fileManagerAttachmentAttachPage.getFileAttachmentSuccessText());
    });

    it('should successfully attach file to an asset', () => {
      const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

      fileManagerAttachmentListPage.visit();
      fileManagerAttachmentListPage.clickAttachButton();

      // Parity with the sibling attach blocks: activate the Asset tab first so the
      // nav-tabs settle and the unattached table is rendered before we search it.
      fileManagerAttachmentAttachPage.selectAttachmentScope('asset');
      fileManagerAttachmentAttachPage.searchUnattachedItem('asset', dynamicFixtures.sspAsset.name);
      fileManagerAttachmentAttachPage.getUnattachedProcessingOverlay('asset').should('not.be.visible');
      fileManagerAttachmentAttachPage
        .getFirstUnattachedRow('asset')
        .should('contain', dynamicFixtures.sspAsset.name)
        .find(fileManagerAttachmentAttachPage.getTableRowCheckboxSelector(), { timeout: 10000 })
        .check({ force: true });
      fileManagerAttachmentAttachPage.submitForm();
      fileManagerAttachmentAttachPage
        .getSuccessMessage()
        .should('be.visible')
        .and('contain', fileManagerAttachmentAttachPage.getFileAttachmentSuccessText());
    });

    it('should successfully attach assets via CSV import', () => {
      const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

      fileManagerAttachmentListPage.visit();
      fileManagerAttachmentListPage.clickAttachButton();

      fileManagerAttachmentAttachPage.uploadCsvFile('asset', 'csv/assets-example.csv');
      fileManagerAttachmentAttachPage.submitForm();
      fileManagerAttachmentAttachPage
        .getSuccessMessage()
        .should('be.visible')
        .and('contain', fileManagerAttachmentAttachPage.getFileAttachmentSuccessText());
    });

    it('should successfully attach business units via CSV import', () => {
      const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

      fileManagerAttachmentListPage.visit();
      fileManagerAttachmentListPage.clickAttachButton();

      fileManagerAttachmentAttachPage.selectAttachmentScope('business-unit');

      fileManagerAttachmentAttachPage.uploadCsvFile('business-unit', 'csv/business-units-example.csv');
      fileManagerAttachmentAttachPage.submitForm();
      fileManagerAttachmentAttachPage
        .getSuccessMessage()
        .should('be.visible')
        .and('contain', fileManagerAttachmentAttachPage.getFileAttachmentSuccessText());
    });

    it('should successfully attach company users via CSV import', () => {
      const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

      fileManagerAttachmentListPage.visit();
      fileManagerAttachmentListPage.clickAttachButton();

      fileManagerAttachmentAttachPage.selectAttachmentScope('company-user');

      fileManagerAttachmentAttachPage.uploadCsvFile('company-user', 'csv/company-users-example.csv');
      fileManagerAttachmentAttachPage.submitForm();
      fileManagerAttachmentAttachPage
        .getSuccessMessage()
        .should('be.visible')
        .and('contain', fileManagerAttachmentAttachPage.getFileAttachmentSuccessText());
    });

    it('should successfully attach companies via CSV import', () => {
      const fileManagerAttachmentAttachPage = container.get(SspFileManagementAttachPage);

      fileManagerAttachmentListPage.visit();
      fileManagerAttachmentListPage.clickAttachButton();

      fileManagerAttachmentAttachPage.selectAttachmentScope('company');

      fileManagerAttachmentAttachPage.uploadCsvFile('company', 'csv/companies-example.csv');
      fileManagerAttachmentAttachPage.submitForm();
      fileManagerAttachmentAttachPage
        .getSuccessMessage()
        .should('be.visible')
        .and('contain', fileManagerAttachmentAttachPage.getFileAttachmentSuccessText());
    });

    it('should successfully detach file from an asset', () => {
      const fileManagerAttachmentDetachPage = container.get(SspFileManagementDetachPage);

      fileManagerAttachmentListPage.visit();
      fileManagerAttachmentListPage.clickViewButton();

      fileManagerAttachmentDetachPage.detachFile();
      fileManagerAttachmentDetachPage
        .getSuccessMessage()
        .should('be.visible')
        .and('contain', 'File attachment successfully unlinked.');
      fileManagerAttachmentDetachPage.getAttachmentTableRows().should('have.length.gte', 1);
    });
  }
);
