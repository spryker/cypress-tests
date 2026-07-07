import { container } from '@utils';
import { CategoryReSortDynamicFixtures, CategoryReSortStaticFixtures } from '@interfaces/backoffice';
import { CategoryReSortPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'category re-sort',
  { tags: ['@backoffice', '@catalog', 'category-management', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    const categoryReSortPage = container.get(CategoryReSortPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: CategoryReSortStaticFixtures;
    let dynamicFixtures: CategoryReSortDynamicFixtures;
    let idCategoryNode: number;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
      idCategoryNode = dynamicFixtures.parentCategory.category_node.id_category_node;
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('Backoffice user should see the sub-categories', (): void => {
      categoryReSortPage.visitReSortPage(idCategoryNode);
      categoryReSortPage.assertSubCategoryVisible('first');
    });

    it('Backoffice user should be able to move sub-categories', (): void => {
      categoryReSortPage.visitReSortPage(idCategoryNode);

      categoryReSortPage.getSubCategoryName('first').then((firstItemName) => {
        categoryReSortPage.reorder('first', 'last');
        categoryReSortPage.reorder('last', 'second');

        categoryReSortPage.assertSubCategoryContains('last', firstItemName);
      });
    });

    it('Backoffice user should be able to save the re-sorted sub-categories', (): void => {
      categoryReSortPage.visitReSortPage(idCategoryNode);

      categoryReSortPage.getSubCategoryName('last').then((lastItemName) => {
        categoryReSortPage.reorder('last', 'first');
        // dragAndDrop cannot land an item in the very first slot, so the source nudges the new top
        // category back down one place; the same two-step is replayed here.
        categoryReSortPage.reorder('first', 'second');

        categoryReSortPage.save();
        categoryReSortPage.assertSaveSuccess();

        categoryReSortPage.visitReSortPage(idCategoryNode);
        categoryReSortPage.assertSubCategoryContains('first', lastItemName);
      });
    });
  }
);
