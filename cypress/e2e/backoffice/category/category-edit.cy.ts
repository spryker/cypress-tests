import { container } from '@utils';
import { CategoryEditStaticFixtures } from '@interfaces/backoffice';
import { CategoryEditPage, CategoryListPage, ActionEnum } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe('category edit', { tags: ['@backoffice', '@catalog'] }, (): void => {
  const categoryListPage = container.get(CategoryListPage);
  const categoryEditPage = container.get(CategoryEditPage);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: CategoryEditStaticFixtures;

  before((): void => {
    staticFixtures = Cypress.env('staticFixtures');
  });

  beforeEach((): void => {
    userLoginScenario.execute({
      username: staticFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });
  });

  it('should not be able to see help text for child category', (): void => {
    goToCategoryEditPage(staticFixtures.parentCategoryName);
    cy.get('body').contains(staticFixtures.helpText).should('exist');
  });

  it('should be able to see help text for child category', (): void => {
    goToCategoryEditPage(staticFixtures.parentCategoryName);
    categoryEditPage.unassignStore({ storeName: staticFixtures.storeNameToUnassign });

    goToCategoryEditPage(staticFixtures.childCategoryName);
    cy.get('body').contains('staticFixtures.helpText');
  });

  function goToCategoryEditPage(categoryName: string): void {
    categoryListPage.visit();
    categoryListPage.update({ query: categoryName, action: ActionEnum.edit });
  }
});
