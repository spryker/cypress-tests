import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ConfigurationPage } from '@pages/backoffice';
import { ConfigurationManagementDynamicFixtures, ConfigurationManagementStaticFixtures } from '@interfaces/backoffice';

describe(
  'Configuration - Management UI',
  {
    tags: ['@backoffice', '@configuration', 'configuration', 'spryker-core-back-office'],
  },
  (): void => {
    const configurationPage = container.get(ConfigurationPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: ConfigurationManagementStaticFixtures;
    let dynamicFixtures: ConfigurationManagementDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('tracks unsaved changes in the sticky save bar and persists value after save', (): void => {
      configurationPage.visitStorefrontTab();

      configurationPage.getSaveBar().should('not.be.visible');

      configurationPage.setThemeMainColor(staticFixtures.themeSettings.validColor);

      configurationPage.getSaveBar().should('be.visible');
      configurationPage.getChangesCount().should('have.text', '1');

      configurationPage.saveConfiguration();
      cy.runQueueWorker();

      configurationPage.visitStorefrontTab();
      configurationPage.getThemeMainColor().should('have.value', staticFixtures.themeSettings.validColor);

      configurationPage.setThemeMainColor(staticFixtures.themeSettings.mainColorDefault);
      configurationPage.saveConfiguration();
      cy.runQueueWorker();
    });
  }
);
