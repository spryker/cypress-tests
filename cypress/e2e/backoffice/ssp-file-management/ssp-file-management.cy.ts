import { container } from '@utils';
import { retryableBefore } from '../../../support/e2e';
import { UserLoginScenario } from '@scenarios/backoffice';
import { SspFileManagementDynamicFixtures, SspFileManagementStaticFixtures } from '@interfaces/backoffice';
import { SspFileManagementListPage, SspFileManagementAttachPage } from '@pages/backoffice';

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
  }
);
