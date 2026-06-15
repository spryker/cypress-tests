import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ConfigurationPage } from '@pages/backoffice';
import { HomePage } from '@pages/yves';
import { ShopThemeSmokeStaticFixtures } from '@interfaces/smoke';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 * This test checks that S3 bucket for logos is present in the infra
 */
describe(
  'shop theme storefront logo',
  {
    tags: ['@smoke', '@shop-theme', '@configuration', 'spryker-core', 'spryker-core-back-office'],
  },
  (): void => {
    if (!['b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for b2b-mp', () => {});
      return;
    }

    const userLoginScenario = container.get(UserLoginScenario);
    const configurationPage = container.get(ConfigurationPage);
    const homePage = container.get(HomePage);

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

    it('storefront logo is uploaded in BO configuration successfully', (): void => {
      configurationPage.visitLogosTab();
      configurationPage.uploadStorefrontLogo(`cypress/fixtures/${staticFixtures.logoFile}`);
      configurationPage.verifyStorefrontLogoUploaded();
      configurationPage.saveConfiguration();
      configurationPage.getUseDefaultLink(staticFixtures.storefrontLogoConfig).should('be.visible');
      configurationPage.getChangesCount().should('not.be.visible');
    });

    it('go to storefront and see the uploaded logo', (): void => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(15000); // since tests do not take a lot of time and including a looping wait to wait for sync is an overkill
      homePage.visit();
      homePage.getLogo().find('img').should('be.visible');
    });

    it('changes in BO can be reverted', (): void => {
      configurationPage.visitLogosTab();
      configurationPage.clickUseDefaultLink(staticFixtures.storefrontLogoConfig);
      configurationPage.saveConfiguration();
      configurationPage.getUseDefaultLink(staticFixtures.storefrontLogoConfig).should('not.be.visible');
    });

    it('go to storefront and see the changes are reverted', (): void => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(15000); // since tests do not take a lot of time and including a looping wait to wait for sync is an overkill
      homePage.visit();
      homePage.getLogo().find('svg').should('be.visible');
    });
  }
);
