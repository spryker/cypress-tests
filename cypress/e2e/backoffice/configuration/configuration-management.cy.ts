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

    it('reverts unsaved changes when reset button is clicked', (): void => {
      configurationPage.visitStorefrontTab();

      configurationPage.setThemeMainColor(staticFixtures.themeSettings.validColor);
      configurationPage.getChangesCount().should('have.text', '1');

      configurationPage.resetChanges();

      configurationPage.getThemeMainColor().should('have.value', staticFixtures.themeSettings.mainColorDefault);
      configurationPage.getSaveBar().should('not.be.visible');
    });

    it('filters sidebar navigation when searching for a term', (): void => {
      configurationPage.visitStorefrontTab();

      configurationPage.searchSettings(staticFixtures.searchTerm);

      cy.get('.js-nav-tab[data-tab="logos"]').should('be.visible');
    });

    it('rejects an invalid hex color and keeps the original value', (): void => {
      configurationPage.visitStorefrontTab();

      configurationPage.getThemeMainColor().invoke('removeAttr', 'type');
      configurationPage.setThemeMainColor(staticFixtures.themeSettings.invalidColor);
      configurationPage.saveConfiguration();

      configurationPage
        .getSettingRow(staticFixtures.themeSettings.mainColorKey)
        .find('.invalid-feedback')
        .should('not.be.empty');

      configurationPage.visitStorefrontTab();
      configurationPage.getThemeMainColor().should('have.value', staticFixtures.themeSettings.mainColorDefault);
    });

    it('reverts an overridden setting to its default via the Use Default link', (): void => {
      configurationPage.visitStorefrontTab();

      configurationPage.setThemeMainColor(staticFixtures.themeSettings.validColor);
      configurationPage.saveConfiguration();
      cy.runQueueWorker();

      configurationPage.visitStorefrontTab();
      configurationPage.clickUseDefaultLink(staticFixtures.themeSettings.mainColorKey);
      configurationPage.saveConfiguration();
      cy.runQueueWorker();

      configurationPage.visitStorefrontTab();
      configurationPage.getThemeMainColor().should('have.value', staticFixtures.themeSettings.mainColorDefault);
    });
  }
);
