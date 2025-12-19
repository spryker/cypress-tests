import { container } from '@utils';
import { CategoryEditDynamicFixtures, CategoryEditStaticFixtures } from '@interfaces/backoffice';
import { CategoryListPage, ActionEnum } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'category edit',
  { tags: ['@backoffice', '@catalog', 'category-management', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    const categoryListPage = container.get(CategoryListPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: CategoryEditStaticFixtures;
    let dynamicFixtures: CategoryEditDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('Backoffice user should not see store help text for parent', (): void => {
      goToCategoryEditPage(staticFixtures.rootCategoryName);
      cy.get('body').contains(staticFixtures.helpText).should('not.exist');
    });

    it('Backoffice user should see store help text for child category', (): void => {
      goToCategoryEditPage(dynamicFixtures.childCategory.category_key);
      cy.get('body').contains(staticFixtures.helpText);
    });

    function goToCategoryEditPage(categorySearchQuery: string): void {
      categoryListPage.visit();
      categoryListPage.update({ query: categorySearchQuery, action: ActionEnum.edit });
    }
  }
);
