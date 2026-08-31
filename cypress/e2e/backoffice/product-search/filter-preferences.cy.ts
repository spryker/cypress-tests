import { container } from '@utils';
import { FilterPreferencesDynamicFixtures, FilterPreferencesStaticFixtures } from '@interfaces/backoffice';
import { ProductSearchPreferencesPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

// The reorder save reports through a SweetAlert whose title carries the outcome.
const SAVE_ORDER_SUCCESS_TITLE = 'Success';

describe('filter preferences', { tags: ['@backoffice', 'product-search', 'spryker-core'] }, (): void => {
  const productSearchPreferencesPage = container.get(ProductSearchPreferencesPage);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: FilterPreferencesStaticFixtures;
  let dynamicFixtures: FilterPreferencesDynamicFixtures;

  // Filter keys are generated per attempt, not once at spec load: the create form rejects a key that
  // already carries a filter preference, so a shared id would make every Cypress retry fail on the
  // row the previous attempt created and hide the original error. There is no DB teardown between
  // attempts. The Codeception original relied on rand().
  const filterKey = (prefix: string): string => `${prefix}_${Math.random().toString(36).substring(2, 8)}`;

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

    productSearchPreferencesPage.getFilterList().should('be.visible');
  });

  it('should create, edit and remove a filter', (): void => {
    const filterName = filterKey('foooooo');

    productSearchPreferencesPage.createFilter(filterName).then((id: string): void => {
      productSearchPreferencesPage.updateFilter(id);
      productSearchPreferencesPage.deleteFilter(id);
    });
  });

  it('should update the filter order via drag and drop and persist it', (): void => {
    productSearchPreferencesPage.createFilter(filterKey('foooooo')).then((idFirst: string): void => {
      productSearchPreferencesPage.createFilter(filterKey('baaaaar')).then((idSecond: string): void => {
        productSearchPreferencesPage.visitFilterReorder();
        productSearchPreferencesPage.getFilterPrecedingSibling(idFirst, idSecond).should('exist');

        // Drag the second filter up onto the first rather than the first down onto the second: the two
        // are adjacent, and a downward drag between neighbours never crosses the target's midpoint, so
        // nestable leaves the order untouched. See dragNestableItem.
        productSearchPreferencesPage.reorderFilter(idSecond, idFirst);
        productSearchPreferencesPage.getFilterPrecedingSibling(idSecond, idFirst).should('exist');

        productSearchPreferencesPage.saveFilterOrder();
        productSearchPreferencesPage
          .getFilterOrderSaveAlert()
          .should('be.visible')
          .and('contain', SAVE_ORDER_SUCCESS_TITLE);

        productSearchPreferencesPage.visitFilterReorder();
        productSearchPreferencesPage.getFilterPrecedingSibling(idSecond, idFirst).should('exist');

        productSearchPreferencesPage.deleteFilter(idFirst);
        productSearchPreferencesPage.deleteFilter(idSecond);
      });
    });
  });
});
