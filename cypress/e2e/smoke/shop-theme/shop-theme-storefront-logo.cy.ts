import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ConfigurationPage } from '@pages/backoffice';
import { HomePage} from '@pages/yves';
import { ShopThemeSmokeStaticFixtures } from '@interfaces/smoke';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 * This test checks that S3 bucket for logos is present in the infra
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
      cy.get('.use-default-link').should("be.visible");
      configurationPage.getChangesCount().should("not.be.visible")
    });

    it('go to storefront and see the uploaded logo', (): void => {
      cy.wait(4000)
      homePage.visit();
      cy.get('[data-qa="component logo"]').find('svg[data-qa="component icon"]')      
        .should('be.visible')
        .and(($img) => {
          expect(($img[0] as HTMLImageElement).naturalWidth, 'image should have loaded (naturalWidth > 0)').to.be.lessThan(100);
        });

    });

    it('changes in BO can be reverted', (): void => {
      configurationPage.visitLogosTab();
      configurationPage.revertToDefault();
      configurationPage.saveConfiguration();
      cy.get('.use-default-link').should("not.be.visible");
      configurationPage.getChangesCount().should("not.be.visible")
    });

    it('go to storefront and see the changes are reverted', (): void => {
      cy.wait(4000)
      homePage.visit();
      cy.get('[data-qa="component logo"]').find('svg[data-qa="component icon"]')      
        .should('be.visible')
        .and(($img) => {
          expect(($img[0] as HTMLImageElement).naturalWidth, 'image should have loaded (naturalWidth > 0)').to.be.greaterThan(100);
        });
    });
  }
);
