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
    let uploadedLogoSrc: string;

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
      homePage.visit();
      cy.get('[data-qa="component logo"]')        
        .should('be.visible')
        //.and(($img) => {
        //  expect(($img[0] as HTMLImageElement).naturalWidth, 'image should have loaded (naturalWidth > 0)').to.be.eq(52);
        .invoke('attr', 'src')
        .then((src) => {
          expect(src, 'logo src').to.be.a('string').and.not.be.empty;
          expect(String(src), 'logo src contains uploaded filename').to.include('spryker-notext-logo.png');
        });

    });

    it('3 - go to BO and revert changes', (): void => {
      configurationPage.visitLogosTab();
      configurationPage.resetChanges();
    });

    it('4 - go to storefront and see the changes are reverted', (): void => {
      homePage.visit();
      cy.get('[data-qa="component logo"]')        
        .should('be.visible')
        //.and(($img) => {
        //  expect(($img[0] as HTMLImageElement).naturalWidth, 'image should have loaded (naturalWidth > 0)').to.be.eq(52);
        .invoke('attr', 'src')
        .then((src) => {
          expect(src, 'logo src').to.be.a('string').and.not.be.empty;
          expect(String(src), 'logo src does not contain uploaded filename').to.not.include('spryker-notext-logo.png');
        });
    });
  }
);
