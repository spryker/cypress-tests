import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { SspModelAddPage } from '@pages/backoffice/';
import { SspModelCreateSmokeStaticFixtures } from '@interfaces/smoke';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 * This test checks that corresponding S3 bucker exists in the infra of the env
 */
describe(
  'ssp model create',
  {
    tags: ['@smoke', '@ssp', '@ssp-model', 'spryker-core', 'spryker-core-back-office'],
  },
  (): void => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b-mp', () => {});
      return;
    }

    const userLoginScenario = container.get(UserLoginScenario);
    const sspModelAddPage = container.get(SspModelAddPage);

    let staticFixtures: SspModelCreateSmokeStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('backoffice user should be able to create a new ssp model with an uploaded image image', (): void => {
      sspModelAddPage.visit();
      sspModelAddPage.fillSspModelForm({
        name: staticFixtures.sspModel.name,
        code: staticFixtures.sspModel.code,
        image: staticFixtures.sspModel.image,
      });
      sspModelAddPage.submitForm();
      sspModelAddPage.verifySuccessMessage();

      cy.get('img[data-qa="ssp-model-image"]')
        .should('be.visible')
        .and(($img) => {
          expect(
            ($img[0] as HTMLImageElement).naturalWidth,
            'image should have loaded (naturalWidth > 0)'
          ).to.be.greaterThan(0);
        });
    });
  }
);
