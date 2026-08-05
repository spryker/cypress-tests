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

    productSearchPreferencesPage.getFilterList().should('be.visible');
  });

  it('should create, edit and remove a filter', (): void => {
    const filterName = `foooooo_${uid}`;

    productSearchPreferencesPage.createFilter(filterName).then((id: string): void => {
      productSearchPreferencesPage.updateFilter(id);
      productSearchPreferencesPage.deleteFilter(id);
    });
  });

  it('should update the filter order via drag and drop and persist it', (): void => {
    productSearchPreferencesPage.createFilter(`reorder_first_${uid}`).then((idFirst: string): void => {
      productSearchPreferencesPage.createFilter(`reorder_second_${uid}`).then((idSecond: string): void => {
        productSearchPreferencesPage.visitFilterReorder();
        productSearchPreferencesPage.getFilterPrecedingSibling(idFirst, idSecond).should('exist');

        productSearchPreferencesPage.reorderFilter(idFirst, idSecond);
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
