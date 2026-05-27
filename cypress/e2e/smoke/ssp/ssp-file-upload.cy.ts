import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { SspFileManagementAddPage, SspFileManagementListPage } from '@pages/backoffice';
import { SspFileUploadSmokeStaticFixtures } from '@interfaces/smoke';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
describe(
  'ssp file upload',
  {
    tags: [
      '@smoke',
      '@ssp',
      '@ssp-file-management',
      'spryker-core',
      'spryker-core-back-office',
    ],
  },
  (): void => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b-mp', () => {});
      return;
    }

    if (!Cypress.env('ENV_IS_SSP_ENABLED')) {
      it.skip('skipped because SSP is not enabled', () => {});
      return;
    }

    const userLoginScenario = container.get(UserLoginScenario);
    const sspFileManagementAddPage = container.get(SspFileManagementAddPage);
    const sspFileManagementListPage = container.get(SspFileManagementListPage);

    let staticFixtures: SspFileUploadSmokeStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('backoffice user should be able to upload a file in the customer portal and verify it appears in the list', (): void => {
      sspFileManagementAddPage.visit();
      sspFileManagementAddPage.loadTestFiles().then((files) => {
        sspFileManagementAddPage.uploadFiles(files);
        sspFileManagementAddPage.submitForm();
        sspFileManagementAddPage.verifySuccessMessage();
      });

      sspFileManagementListPage.visit();
      sspFileManagementListPage.verifyListPage();
      sspFileManagementListPage.searchFile(staticFixtures.uploadedFileName);
      cy.contains(staticFixtures.uploadedFileName).should('exist');
    });
  }
);
