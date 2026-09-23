import { container } from '@utils';
import { CategoryEditDynamicFixtures, CategoryEditStaticFixtures } from '@interfaces/backoffice';
import { CategoryEditPage, CategoryListPage, ActionEnum } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'category edit',
  { tags: ['@backoffice', '@catalog', 'category-management', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    const categoryEditPage = container.get(CategoryEditPage);
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
      categoryListPage.assertBodyContainsText(staticFixtures.helpText).should('not.exist');
    });

    it('Backoffice user should see store help text for child category', (): void => {
      goToCategoryEditPage(dynamicFixtures.childCategory.category_key);
      categoryListPage.assertBodyContainsText(staticFixtures.helpText);
    });

    it('Backoffice user should be able to open the edit category page', (): void => {
      categoryEditPage.visitEditPage(dynamicFixtures.childCategory.id_category);

      categoryEditPage.getHeading().should('contain', categoryEditPage.getHeadingText()).and('be.visible');
      categoryEditPage.getKeyInput().should('have.value', dynamicFixtures.childCategory.category_key);
    });

    it('Backoffice user should be able to edit category checkboxes', (): void => {
      categoryEditPage.visitEditPage(dynamicFixtures.childCategory.id_category);

      // Defaults seeded on childCategory: inactive, in-menu, searchable.
      categoryEditPage.getFlagCheckbox('is_active').should('not.be.checked');
      categoryEditPage.getFlagCheckbox('is_in_menu').should('be.checked');
      categoryEditPage.getFlagCheckbox('is_searchable').should('be.checked');

      categoryEditPage.toggleFlag('is_active');
      categoryEditPage.toggleFlag('is_in_menu');
      categoryEditPage.toggleFlag('is_searchable');

      categoryEditPage.submit();

      categoryEditPage.getUpdateSuccessMessage().should('be.visible');
    });

    function goToCategoryEditPage(categorySearchQuery: string): void {
      categoryListPage.visit();
      categoryListPage.update({ query: categorySearchQuery, action: ActionEnum.edit });
    }
  }
);
