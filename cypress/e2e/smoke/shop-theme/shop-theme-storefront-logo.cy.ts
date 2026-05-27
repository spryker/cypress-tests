import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ConfigurationPage } from '@pages/backoffice';
import { StorefrontLogoPage } from '@pages/yves';
import { ShopThemeSmokeStaticFixtures } from '@interfaces/smoke';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 * This test checks that the storefront logo can be uploaded via Configuration -> Theme -> Logos,
 * verified on the storefront, then reset to default in backoffice.
 */
describe(
  'shop theme storefront logo',
  {
    tags: [
      '@smoke',
      '@shop-theme',
      '@configuration',
      'spryker-core',
      'spryker-core-back-office',
    ],
  },
  (): void => {
    if (!['b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for b2b-mp', () => {});
      return;
    }

    const userLoginScenario = container.get(UserLoginScenario);
    const configurationPage = container.get(ConfigurationPage);
    const storefrontLogoPage = container.get(StorefrontLogoPage);

    let staticFixtures: ShopThemeSmokeStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('backoffice user should be able to upload storefront logo and verify it on the storefront, then reset to default', (): void => {
      // Step 1: Upload storefront logo via Configuration -> Theme -> Logos
      configurationPage.visitLogosTab();
      configurationPage.uploadStorefrontLogo(`cypress/fixtures/${staticFixtures.logoFile}`);
      configurationPage.verifyStorefrontLogoUploaded();
      configurationPage.saveConfiguration();

      // Step 2: Visit the storefront and verify the logo is visible
      storefrontLogoPage.visit();
      storefrontLogoPage.verifyLogoIsVisible();

      // Step 3: Go back to backoffice and reset the logo to default
      configurationPage.visitLogosTab();
      configurationPage.resetChanges();
    });
  }
);
