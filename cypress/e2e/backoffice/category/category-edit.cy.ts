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

    it('Backoffice user should be able to open the edit category page', (): void => {
      cy.visitBackoffice(`/category-gui/edit?id-category=${dynamicFixtures.childCategory.id_category}`);

      cy.contains('h2', 'Edit category').should('be.visible');
      cy.get('[name="category[category_key]"]').should('have.value', dynamicFixtures.childCategory.category_key);
    });

    it('Backoffice user should be able to edit category checkboxes', (): void => {
      cy.visitBackoffice(`/category-gui/edit?id-category=${dynamicFixtures.childCategory.id_category}`);

      // Defaults seeded on childCategory: inactive, in-menu, searchable.
      cy.get('[name="category[is_active]"]').should('not.be.checked');
      cy.get('[name="category[is_in_menu]"]').should('be.checked');
      cy.get('[name="category[is_searchable]"]').should('be.checked');

      cy.get('[name="category[is_active]"]').click({ force: true });
      cy.get('[name="category[is_in_menu]"]').click({ force: true });
      cy.get('[name="category[is_searchable]"]').click({ force: true });

      cy.get('button.btn-primary.safe-submit').click();

      cy.contains('The category was updated successfully.').should('be.visible');
    });

    function goToCategoryEditPage(categorySearchQuery: string): void {
      categoryListPage.visit();
      categoryListPage.update({ query: categorySearchQuery, action: ActionEnum.edit });
    }
  }
);
