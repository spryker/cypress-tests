import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ConfigurationPage } from '@pages/backoffice';
import { ShopThemeSmokeStaticFixtures } from '@interfaces/smoke';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 * This test checks that the storefront logo can be uploaded via Configuration -> Theme -> Logos,
 * verified on the storefront, then reverted to default in backoffice and verified again.
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

    let staticFixtures: ShopThemeSmokeStaticFixtures;
    let uploadedLogoSrc: string;

    const visitStorefrontHome = (): void => {
      cy.visit('/');
    };

    const getStorefrontLogoImg = (): Cypress.Chainable<JQuery<HTMLImageElement>> => {
      // Generic selector; adjust later if a stable data-qa selector exists in the storefront.
      return cy.get('img[alt*="logo"], img[class*="logo"], header img, .logo img').first() as Cypress.Chainable<
        JQuery<HTMLImageElement>
      >;
    };

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('1 - logo is uploaded in BO successfully', (): void => {
      configurationPage.visitLogosTab();
      configurationPage.uploadStorefrontLogo(`cypress/fixtures/${staticFixtures.logoFile}`);
      configurationPage.verifyStorefrontLogoUploaded();
      configurationPage.saveConfiguration();
    });

    it('2 - go to storefront and see it is there', (): void => {
      visitStorefrontHome();
      getStorefrontLogoImg()
        .should('be.visible')
        .invoke('attr', 'src')
        .then((src) => {
          expect(src, 'logo src').to.be.a('string').and.not.be.empty;
          uploadedLogoSrc = String(src);
        });
    });

    it('3 - go to BO and revert changes', (): void => {
      configurationPage.visitLogosTab();
      configurationPage.resetChanges();
    });

    it('4 - go to storefront and see the changes are reverted', (): void => {
      visitStorefrontHome();
      getStorefrontLogoImg()
        .should('be.visible')
        .invoke('attr', 'src')
        .then((src) => {
          expect(src, 'logo src').to.be.a('string').and.not.be.empty;

          if (uploadedLogoSrc) {
            expect(String(src), 'default logo src differs from uploaded logo src').to.not.equal(uploadedLogoSrc);
          }
        });
    });
  }
);
