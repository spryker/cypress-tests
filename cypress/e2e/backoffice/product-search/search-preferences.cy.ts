import { container } from '@utils';
import { SearchPreferencesDynamicFixtures, SearchPreferencesStaticFixtures } from '@interfaces/backoffice';
import { ProductSearchPreferencesPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe('search preferences', { tags: ['@backoffice', 'product-search', 'spryker-core'] }, (): void => {
  const productSearchPreferencesPage = container.get(ProductSearchPreferencesPage);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: SearchPreferencesStaticFixtures;
  let dynamicFixtures: SearchPreferencesDynamicFixtures;

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

    productSearchPreferencesPage.getSearchPreferencesList().should('be.visible');
  });
});
