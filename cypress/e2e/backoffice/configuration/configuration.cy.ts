import { container, skipWhenFeatureAbsent } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ConfigurationPage } from '@pages/backoffice';
import { HomePage } from '@pages/yves';
import { ConfigurationDynamicFixtures, ConfigurationStaticFixtures } from '@interfaces/backoffice';

describe(
  'Configuration - Theme Settings',
  {
    tags: ['@backoffice', '@configuration', 'shop-theme', 'spryker-core-back-office'],
  },
  (): void => {
    // The B2C shops do not install the configuration module.
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the B2C shops have no configuration management', () => {});

      return;
    }

    skipWhenFeatureAbsent('configuration', ['b2b']);

    const configurationPage = container.get(ConfigurationPage);
    const homePage = container.get(HomePage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: ConfigurationStaticFixtures;
    let dynamicFixtures: ConfigurationDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('uploads storefront logo and verifies it is applied in yves', (): void => {
      configurationPage.visitLogosTab();
      configurationPage.uploadStorefrontLogo(staticFixtures.logoFilePath);
      cy.wait('@logoUpload').its('response.statusCode').should('eq', 200);
      configurationPage.getStorefrontLogoUploadButton().should('contain.text', 'Change File');
      configurationPage.getStorefrontLogoHiddenValueInput().should('not.have.value', '');
      configurationPage.saveConfiguration();

      cy.runQueueWorker();

      cy.visit('/');
      homePage.getLogoImage().should('have.attr', 'src').and('not.be.empty');
    });
  }
);
