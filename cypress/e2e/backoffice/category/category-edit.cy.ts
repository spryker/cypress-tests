import { container } from '@utils';
import {
    CategoryEditStaticFixtures,
    CustomOrderReferenceManagementDynamicFixtures,
} from '@interfaces/backoffice';
import { CategoryListPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ActionEnum } from '../../../support/pages/backoffice';

describe('category edit', { tags: ['@catalog'] }, (): void => {
  const categoryListPage = container.get(CategoryListPage);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: CategoryEditStaticFixtures;
  // let dynamicFixtures: CustomOrderReferenceManagementDynamicFixtures;

  before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
      Cypress.config('requestTimeout', 15000);
  });

    // before((): void => {
    //     ({ staticFixtures } = Cypress.env());
    // });

    beforeEach((): void => {
        userLoginScenario.execute({
            username: staticFixtures.rootUser.username,
            password: staticFixtures.defaultPassword,
        });
    });

  it('should be able to see help text for child category', (): void => {
    // userLoginScenario.execute({
    //   username: dynamicFixtures.rootUser.username,
    //   password: staticFixtures.defaultPassword,
    // });

    goToCategoryEditPage(staticFixtures.childCategoryName);

    cy.get('body').contains(staticFixtures.helpText);
  });

  it('should not be able to see help text for child category', (): void => {
    // userLoginScenario.execute({
    //   username: staticFixtures.rootUser.username,
    //   password: staticFixtures.defaultPassword,
    // });

    goToCategoryEditPage(staticFixtures.parentCategoryName);

    cy.get('body').contains(staticFixtures.helpText).should('not.exist');
  });

  function goToCategoryEditPage(categoryName: string): void {
     categoryListPage.visit();
     categoryListPage.update({ query: categoryName, action: ActionEnum.edit })
  }
});
