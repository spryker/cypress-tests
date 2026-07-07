import { container } from '@utils';
import { SspAssetCreatePage, SspAssetDetailPage, LoginPage } from '@pages/yves';
import { SspAssetCreateSmokeStaticFixtures } from '@interfaces/smoke';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 * This test checks that corresponding S3 bucker exists in the infra of the env
 */
describe(
  'ssp asset create',
  {
    tags: ['@smoke', '@ssp', '@ssp-asset', 'spryker-core'],
  },
  (): void => {
    if (!['b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for b2b-mp', () => {});
      return;
    }

    const loginPage = container.get(LoginPage);
    const assetCreatePage = container.get(SspAssetCreatePage);
    const assetDetailPage = container.get(SspAssetDetailPage);

    let staticFixtures: SspAssetCreateSmokeStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    it('customer should be able to create an asset with an image on Yves', (): void => {
      loginPage.visit();
      loginPage.login({
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      assetCreatePage.visit();

      assetCreatePage.createAsset({
        name: staticFixtures.asset.name,
        serialNumber: staticFixtures.asset.serial_number,
        note: staticFixtures.asset.note,
        image: staticFixtures.asset.image,
      });

      assetCreatePage.assertBodyContainsText(assetCreatePage.getAssetCreatedMessage());

      assetDetailPage.assertPageLocation();

      assetDetailPage.assertAssetDetails({
        name: staticFixtures.asset.name,
        serialNumber: staticFixtures.asset.serial_number,
        note: staticFixtures.asset.note,
        image: staticFixtures.asset.image,
      });
    });
  }
);
