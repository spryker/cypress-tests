import { container } from '@utils';
import { FilterPreferencesDynamicFixtures, FilterPreferencesStaticFixtures } from '@interfaces/backoffice';
import { ProductSearchPreferencesPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe('filter preferences', { tags: ['@backoffice', 'product-search', 'spryker-core'] }, (): void => {
  const productSearchPreferencesPage = container.get(ProductSearchPreferencesPage);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: FilterPreferencesStaticFixtures;
  let dynamicFixtures: FilterPreferencesDynamicFixtures;

  // Filter keys are made run-unique so repeated CI runs never collide on the
  // "already exists" validation. The Codeception original relied on rand().
  const uid = Math.random().toString(36).substring(2, 8);

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });
  });

  it('should show the list of filter preferences', (): void => {
    productSearchPreferencesPage.visitFilterList();
    productSearchPreferencesPage.assertFilterListVisible();
  });

  it('should create, edit and remove a filter', (): void => {
    const filterName = `foooooo_${uid}`;

    productSearchPreferencesPage.createFilter(filterName).then((id: string): void => {
      productSearchPreferencesPage.updateFilter(id);
      productSearchPreferencesPage.deleteFilter(id);
    });
  });

  // Skipped in the Codeception source (@skip) due to flakiness — see CC-25718.
  // Ported as a pointer-event drag sequence; the exact drag mechanics are an
  // unverified guess and must be validated when this is re-enabled.
  it.skip('should update the filter order via drag and drop', (): void => {
    const fooName = `foooooo_${uid}`;
    const barName = `baaaaar_${uid}`;

    productSearchPreferencesPage.createFilter(fooName).then((idFoo: string): void => {
      productSearchPreferencesPage.createFilter(barName).then((idBar: string): void => {
        productSearchPreferencesPage.visitFilterReorder();

        const fooSelector = `li[data-id-product-search-attribute="${idFoo}"]`;
        const barSelector = `li[data-id-product-search-attribute="${idBar}"]`;

        // Initial order: foo precedes bar.
        cy.get(`${fooSelector} ~ ${barSelector}`).should('exist');

        // Drag foo below bar via a pointer-event sequence.
        cy.get(fooSelector).trigger('pointerdown', { which: 1, button: 0 });
        cy.get(barSelector).trigger('pointermove');
        cy.get(barSelector).trigger('pointerup', { force: true });

        // Order after reorder: bar precedes foo.
        cy.get(`${barSelector} ~ ${fooSelector}`).should('exist');

        cy.get('#save-filter-order').click();
        cy.get('.swal2-title').should('contain', 'Success');

        // Persisted after reload.
        cy.reload();
        cy.get(`${barSelector} ~ ${fooSelector}`).should('exist');
      });
    });
  });

  // Skipped in the Codeception source (@skip) due to flakiness — see CC-25718.
  it.skip('should synchronize filter preferences', (): void => {
    productSearchPreferencesPage.createFilter(`foooooo_${uid}`).then((): void => {
      productSearchPreferencesPage.visitFilterList();
      productSearchPreferencesPage.synchronizeFilters();
    });
  });
});
