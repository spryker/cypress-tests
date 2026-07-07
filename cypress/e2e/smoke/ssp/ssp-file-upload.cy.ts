import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { SspFileManagementAddPage, SspFileManagementListPage } from '@pages/backoffice';
import { SspFileUploadSmokeStaticFixtures } from '@interfaces/smoke';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 * This test checks that corresponding S3 bucker exists in the infra of the env
 */
describe(
  'ssp file upload',
  {
    tags: ['@smoke', '@ssp', '@ssp-file-management', 'spryker-core', 'spryker-core-back-office'],
  },
  (): void => {
    if (!['b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for b2b-mp', () => {});
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

      cy.fixture(staticFixtures.file, 'binary').then((fileContent) => {
        sspFileManagementAddPage.uploadFiles([
          {
            fileContent,
            fileName: staticFixtures.uploadedFileName,
            mimeType: 'image/png',
            filePath: `cypress/fixtures/${staticFixtures.file}`,
          },
        ]);
      });

      sspFileManagementAddPage.submitForm();
      sspFileManagementAddPage.verifySuccessMessage();

      sspFileManagementListPage.visit();
      sspFileManagementListPage.verifyListPage();
      sspFileManagementListPage.searchFile(staticFixtures.uploadedFileName);
      sspFileManagementListPage.assertBodyContainsText(staticFixtures.uploadedFileName).should('exist');
    });
  }
);
