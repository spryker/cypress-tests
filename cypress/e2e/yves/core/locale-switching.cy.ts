import { container } from '@utils';
import { LocaleSwitchingScenario } from '@scenarios/yves';
import { CatalogPage, IndexPage } from '@pages/yves';
import { LocaleStaticFixtures } from '@interfaces/yves';

(['b2c', 'b2c-mp', 'b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'locale switching',
  { tags: ['@core', '@yves'] },
  (): void => {
    const indexPage = container.get(IndexPage);
    const catalogPage = container.get(CatalogPage);
    const localeSwitchingScenario = container.get(LocaleSwitchingScenario);

    let staticFixtures: LocaleStaticFixtures;

    before((): void => {
      ({ staticFixtures } = Cypress.env());
    });

    /**
     * Helper method for testing locale switching on any page.
     * @param visitPage - Function to visit the page (e.g., `catalogPage.visit`).
     */
    const testLocaleSwitching = (visitPage: () => void): void => {
      visitPage();

      localeSwitchingScenario.getAvailableLocales().then((locales) => {
        expect(locales).to.include.members(staticFixtures.availableLocales);
      });

      localeSwitchingScenario.switchLocale(staticFixtures.localeDE.split('_')[0]);
      localeSwitchingScenario.getCurrentLocale(staticFixtures.localeDE);

      cy.reload();
      localeSwitchingScenario.getCurrentLocale(staticFixtures.localeDE);

      localeSwitchingScenario.switchLocale(staticFixtures.localeEN.split('_')[0]);
      localeSwitchingScenario.getCurrentLocale(staticFixtures.localeEN);
    };

    // it('Should be able to switch locales at the home page.', (): void => {
    //   testLocaleSwitching(() => indexPage.visit());
    // });
    //
    // it('Should be able to switch locales at the catalog page.', (): void => {
    //   testLocaleSwitching(() => catalogPage.visit());
    // });

    it('Should be able to switch locales at the product detailed page.', (): void => {
      catalogPage.visit();

      testLocaleSwitching(() => catalogPage.search({ query: 'Canon IXUS 285' }));
    });
  }
);
