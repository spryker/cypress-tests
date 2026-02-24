import { container } from '@utils';
import { ProductManagementListPage, StatusEnum } from '@pages/backoffice';
import { ProductManagementStaticFixtures, ProductManagementDynamicFixtures } from '@interfaces/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'product management filter',
  { tags: ['@backoffice', '@product-management', 'product', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    const productManagementListPage = container.get(ProductManagementListPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let dynamicFixtures: ProductManagementDynamicFixtures;
    let staticFixtures: ProductManagementStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach(() => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('search with filters shows only matching active products', (): void => {
      productManagementListPage.visit();
      productManagementListPage.applyFilters({
        status: StatusEnum.active,
        query: dynamicFixtures.product.localized_attributes[0].name,
        stores: [dynamicFixtures.storeDE.name, dynamicFixtures.storeAT.name],
      });
      productManagementListPage.getTableRows().should('have.length', 1);
    });

    it('search with filters returns no results when criteria don’t match', (): void => {
      productManagementListPage.visit();
      productManagementListPage.applyFilters({
        status: StatusEnum.active,
        query: dynamicFixtures.product.localized_attributes[0].name,
        stores: [dynamicFixtures.storeAT.name],
      });
      productManagementListPage.assertNoTableRecords();
    });

    it('resetting filters restores all search results', (): void => {
      productManagementListPage.visit();
      productManagementListPage.applyFilters({
        status: StatusEnum.active,
        query: dynamicFixtures.product.localized_attributes[0].name,
        stores: [dynamicFixtures.storeAT.name],
      });
      productManagementListPage.getTableRows().should('have.length', 0);
      productManagementListPage.getResetButton().click();
      productManagementListPage.getTableRows().should('have.length', 2);
    });
  }
);
