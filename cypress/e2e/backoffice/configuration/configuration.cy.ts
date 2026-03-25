import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ConfigurationPage } from  '@pages/backoffice'
import {
  ConfigurationDynamicFixtures,
  ConfigurationStaticFixtures,
} from '@interfaces/backoffice';

describe(
  'Configuration - Theme Settings',
  {
    tags: ['@backoffice', '@configuration', 'shop-theme', 'spryker-core-back-office'],
  },
  (): void => {
    const configurationPage = container.get(ConfigurationPage);
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

    it('displays logo upload buttons for all three application contexts', (): void => {
      configurationPage.visitLogosTab();

      configurationPage.getBackofficeLogoUploadButton().should('exist');
      configurationPage.getMerchantPortalLogoUploadButton().should('exist');
      configurationPage.getStorefrontLogoUploadButton().should('exist');
    });

    it('displays storefront color settings with correct default values', (): void => {
      configurationPage.visitStorefrontTab();

      configurationPage.getThemeMainColor().should('have.value', staticFixtures.defaultColors.themeMainColor);
      configurationPage.getThemeAltColor().should('have.value', staticFixtures.defaultColors.themeAltColor);
      configurationPage.getCustomCss().should('exist');
    });

    it('displays back office color setting with correct default value', (): void => {
      configurationPage.visitBackofficeTab();

      configurationPage.getBackofficeColor().should('have.value', staticFixtures.defaultColors.backofficeColor);
    });

    it('displays merchant portal color setting with correct default value', (): void => {
      configurationPage.visitMerchantPortalTab();

      configurationPage.getMerchantPortalColor().should('have.value', staticFixtures.defaultColors.merchantPortalColor);
    });

    it('allows changing scope to store level on storefront tab', (): void => {
      configurationPage.visitStorefrontTab();

      configurationPage.getScopeSelector().select('DE');

      configurationPage.getThemeMainColor().should('exist');
      configurationPage.getThemeAltColor().should('exist');
    });

    it('applies storefront theme color change to yves CSS variable', (): void => {
      configurationPage.visitStorefrontTab();
      configurationPage.setThemeMainColor(staticFixtures.testColor);
      configurationPage.saveConfiguration();

      cy.runQueueWorker();

      cy.visit('/');
      cy.window().then((win): void => {
        const color = win.getComputedStyle(win.document.documentElement).getPropertyValue('--yves-main-color').trim();

        expect(color).to.equal(staticFixtures.testColor);
      });

      // Reset to default
      configurationPage.visitStorefrontTab();
      configurationPage.setThemeMainColor(staticFixtures.defaultColors.themeMainColor);
      configurationPage.saveConfiguration();
      cy.runQueueWorker();
    });

    it('applies backoffice theme color change to backoffice CSS variable', (): void => {
      configurationPage.visitBackofficeTab();
      configurationPage.setBackofficeColor(staticFixtures.testColor);
      configurationPage.saveConfiguration();

      cy.visitBackoffice('/dashboard');
      cy.window().then((win): void => {
        const color = win.getComputedStyle(win.document.documentElement).getPropertyValue('--bo-main-color').trim();

        expect(color).to.equal(staticFixtures.testColor);
      });

      configurationPage.visitBackofficeTab();
      configurationPage.setBackofficeColor(staticFixtures.defaultColors.backofficeColor);
      configurationPage.saveConfiguration();
    });

    it('applies merchant portal theme color change to merchant portal CSS variable', (): void => {
      configurationPage.visitMerchantPortalTab();
      configurationPage.setMerchantPortalColor(staticFixtures.testColor);
      configurationPage.saveConfiguration();

      cy.visitMerchantPortal('/security-merchant-portal-gui/login');
      cy.window().then((win): void => {
        const color = win.getComputedStyle(win.document.documentElement).getPropertyValue('--spy-primary-color').trim();

        expect(color).to.equal(staticFixtures.testColor);
      });

      configurationPage.visitMerchantPortalTab();
      configurationPage.setMerchantPortalColor(staticFixtures.defaultColors.merchantPortalColor);
      configurationPage.saveConfiguration();
    });
  }
);
