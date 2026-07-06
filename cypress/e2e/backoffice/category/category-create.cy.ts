import { container } from '@utils';
import { CategoryCreateDynamicFixtures, CategoryCreateStaticFixtures } from '@interfaces/backoffice';
import { CategoryCreatePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'category create',
  { tags: ['@backoffice', '@catalog', 'category-management', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    const categoryCreatePage = container.get(CategoryCreatePage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: CategoryCreateStaticFixtures;
    let dynamicFixtures: CategoryCreateDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('Backoffice user should be able to create a category', (): void => {
      // Run-unique key so a retry or a repeated CI run never collides on the category-key
      // uniqueness constraint (the Codeception original relied on a Propel teardown to purge it).
      const categoryKey = `category-a-${Date.now()}`;

      categoryCreatePage.visit();
      categoryCreatePage.assertBreadcrumb('Create category');

      categoryCreatePage.createCategory({
        categoryKey,
        // Parent = root node (value "1") and Default template (value "1"), matching the source Cest.
        parentNodeValue: '1',
        templateValue: '1',
        localizedAttributes: [
          categoryCreatePage.buildLocalizedAttributes(categoryKey, 0, 'en_US'),
          categoryCreatePage.buildLocalizedAttributes(categoryKey, 1, 'de_DE'),
        ],
      });

      categoryCreatePage.assertSuccessMessage();
    });
  }
);
