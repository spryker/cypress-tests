import { container } from '@utils';
import { LocaleSwitchingScenario } from '@scenarios/yves';
import { CatalogPage, HomePage } from '@pages/yves';
import { LocaleStaticFixtures } from '@interfaces/yves';

describe('locale switching', { tags: ['@core', '@yves'] }, (): void => {
    const homePage = container.get(HomePage);
    const catalogPage = container.get(CatalogPage);
    const localeSwitchingScenario = container.get(LocaleSwitchingScenario);

    let staticFixtures: LocaleStaticFixtures;

    before((): void => {
      ({ staticFixtures } = Cypress.env());
    });

    /**
     * Helper method for testing locale switching on any page.
     * @param visitPage - Function to visit the page (e.g., `catalogPage.visit`).
     * @param page - The page object containing methods like `getAvailableLocales`.
     */
    const testLocaleSwitching = (visitPage: () => void, page: { getAvailableLocales: () => void }): void => {
      visitPage();

      page.getAvailableLocales();

      localeSwitchingScenario.execute({
        currentLocale: staticFixtures.localeEN,
        selectedLocale: staticFixtures.localeDE,
      });

      cy.reload();
      localeSwitchingScenario.execute({
        currentLocale: staticFixtures.localeDE,
        selectedLocale: staticFixtures.localeEN,
      });
    };

    skipDisabledDynamicStoreIt('should be able to switch locales at the home page.', (): void => {
      testLocaleSwitching(() => homePage.visit(), homePage);
    });

    it('should be able to switch locales at the catalog page.', (): void => {
      testLocaleSwitching(() => catalogPage.visit(), catalogPage);
    });

    it('should be able to switch locales at the product detailed page.', (): void => {
      testLocaleSwitching(() => {
        catalogPage.visit();
        catalogPage.goToFirstItemInCatalogPage();
      }, catalogPage);
    });

    function skipDisabledDynamicStoreIt(description: string, testFn: () => void): void {
      (Cypress.env('isDynamicStoreEnabled') ? it : it.skip)(description, testFn);
    }
  }
);
