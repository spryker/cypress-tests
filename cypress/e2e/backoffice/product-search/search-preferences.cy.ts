import { container } from '@utils';
import { SearchPreferencesDynamicFixtures, SearchPreferencesStaticFixtures } from '@interfaces/backoffice';
import { ProductSearchPreferencesPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe('search preferences', { tags: ['@backoffice', 'product-search', 'spryker-core'] }, (): void => {
  const productSearchPreferencesPage = container.get(ProductSearchPreferencesPage);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: SearchPreferencesStaticFixtures;
  let dynamicFixtures: SearchPreferencesDynamicFixtures;

  // Attribute keys are made run-unique so repeated CI runs never collide.
  // The Codeception original relied on rand().
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

  it('should show the list of search preferences', (): void => {
    productSearchPreferencesPage.visitSearchList();
    productSearchPreferencesPage.assertSearchPreferencesListVisible();
  });

  // Skipped in the Codeception source (@skip) due to flakiness — see CC-25718.
  it.skip('should add, edit and deactivate an attribute to search', (): void => {
    const attributeKey = `foooooo_${uid}`;

    productSearchPreferencesPage.addAttributeToSearch(attributeKey);
    productSearchPreferencesPage.updateAttributeToSearch(attributeKey);
    productSearchPreferencesPage.deactivateAttributeToSearch(attributeKey);
  });

  // Skipped in the Codeception source (@skip) due to flakiness — see CC-25718.
  it.skip('should synchronize search preferences', (): void => {
    const attributeKey = `foooooo_${uid}`;

    productSearchPreferencesPage.addAttributeToSearch(attributeKey);
    productSearchPreferencesPage.visitSearchList();
    productSearchPreferencesPage.synchronizeSearchPreferences();

    // Original clears the attribute afterwards until per-test state is isolated.
    productSearchPreferencesPage.deactivateAttributeToSearch(attributeKey);
  });
});
