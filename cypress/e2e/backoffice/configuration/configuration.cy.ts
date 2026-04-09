import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ConfigurationPage } from '@pages/backoffice';
import { ConfigurationDynamicFixtures, ConfigurationStaticFixtures } from '@interfaces/backoffice';

describe(
  'Configuration - Theme Settings',
  {
    tags: ['@backoffice', '@configuration', 'shop-theme', 'spryker-core-back-office'],
  },
  (): void => {
    const merchantIt = (description: string, testFn: () => void): void => {
      (['suite', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? it : it.skip)(description, testFn);
    };

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
      configurationPage
        .getBackofficeSidenavColor()
        .should('have.value', staticFixtures.defaultColors.backofficeSidenavColor);
      configurationPage
        .getBackofficeSidenavTextColor()
        .should('have.value', staticFixtures.defaultColors.backofficeSidenavTextColor);
    });

    merchantIt('displays merchant portal color setting with correct default value', (): void => {
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
        const color = win
          .getComputedStyle(win.document.documentElement)
          .getPropertyValue(staticFixtures.cssVariables.storefrontMainColor)
          .trim();

        expect(color).to.equal(staticFixtures.testColor);
      });

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
        const color = win
          .getComputedStyle(win.document.documentElement)
          .getPropertyValue(staticFixtures.cssVariables.backofficeMainColor)
          .trim();

        expect(color).to.equal(staticFixtures.testColor);
      });

      configurationPage.visitBackofficeTab();
      configurationPage.setBackofficeColor(staticFixtures.defaultColors.backofficeColor);
      configurationPage.saveConfiguration();
    });

    it('applies backoffice side navigation color change to backoffice CSS variable', (): void => {
      configurationPage.visitBackofficeTab();
      configurationPage.setBackofficeSidenavColor(staticFixtures.testColor);
      configurationPage.saveConfiguration();

      cy.visitBackoffice('/dashboard');
      cy.window().then((win): void => {
        const color = win
          .getComputedStyle(win.document.documentElement)
          .getPropertyValue(staticFixtures.cssVariables.backofficeSidenavColor)
          .trim();

        expect(color).to.equal(staticFixtures.testColor);
      });

      configurationPage.visitBackofficeTab();
      configurationPage.setBackofficeSidenavColor(staticFixtures.defaultColors.backofficeSidenavColor);
      configurationPage.saveConfiguration();
    });

    it('applies backoffice side navigation text color change to backoffice CSS variable', (): void => {
      configurationPage.visitBackofficeTab();
      configurationPage.setBackofficeSidenavTextColor(staticFixtures.testColor);
      configurationPage.saveConfiguration();

      cy.visitBackoffice('/dashboard');
      cy.window().then((win): void => {
        const color = win
          .getComputedStyle(win.document.documentElement)
          .getPropertyValue(staticFixtures.cssVariables.backofficeSidenavTextColor)
          .trim();

        expect(color).to.equal(staticFixtures.testColor);
      });

      configurationPage.visitBackofficeTab();
      configurationPage.setBackofficeSidenavTextColor(staticFixtures.defaultColors.backofficeSidenavTextColor);
      configurationPage.saveConfiguration();
    });

    merchantIt('applies merchant portal theme color change to merchant portal CSS variable', (): void => {
      configurationPage.visitMerchantPortalTab();
      configurationPage.setMerchantPortalColor(staticFixtures.testColor);
      configurationPage.saveConfiguration();

      cy.visitMerchantPortal('/security-merchant-portal-gui/login');
      cy.window().then((win): void => {
        const color = win
          .getComputedStyle(win.document.documentElement)
          .getPropertyValue(staticFixtures.cssVariables.merchantPortalMainColor)
          .trim();

        expect(color).to.equal(staticFixtures.testColor);
      });

      configurationPage.visitMerchantPortalTab();
      configurationPage.setMerchantPortalColor(staticFixtures.defaultColors.merchantPortalColor);
      configurationPage.saveConfiguration();
    });

    it('uploads storefront logo and verifies it is applied in yves', (): void => {
      configurationPage.visitLogosTab();
      configurationPage.uploadStorefrontLogo(staticFixtures.logoFilePath);
      configurationPage.verifyStorefrontLogoUploaded();
      configurationPage.saveConfiguration();

      cy.runQueueWorker();

      cy.visit('/');
      cy.get('.logo img').should('have.attr', 'src').and('not.be.empty');
    });

    it('uploads backoffice logo and verifies it is applied in backoffice', (): void => {
      configurationPage.visitLogosTab();
      configurationPage.uploadBackofficeLogo(staticFixtures.logoFilePath);
      configurationPage.verifyBackofficeLogoUploaded();
      configurationPage.saveConfiguration();

      cy.visitBackoffice('/dashboard');
      cy.window().then((win): void => {
        const logoVar = win
          .getComputedStyle(win.document.documentElement)
          .getPropertyValue(staticFixtures.cssVariables.backofficeLogoUrl)
          .trim();

        expect(logoVar).to.include('url(');
      });
    });

    merchantIt('uploads merchant portal logo and verifies it is applied in merchant portal', (): void => {
      configurationPage.visitLogosTab();
      configurationPage.uploadMerchantPortalLogo(staticFixtures.logoFilePath);
      configurationPage.verifyMerchantPortalLogoUploaded();
      configurationPage.saveConfiguration();

      cy.visitMerchantPortal('/security-merchant-portal-gui/login');
      cy.window().then((win): void => {
        const logoVar = win
          .getComputedStyle(win.document.documentElement)
          .getPropertyValue(staticFixtures.cssVariables.merchantPortalLogoFull)
          .trim();

        expect(logoVar).to.include('url(');
      });
    });
  }
);
