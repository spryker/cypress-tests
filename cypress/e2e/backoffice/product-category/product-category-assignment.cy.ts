import { container } from '@utils';
import {
  ProductCategoryAssignmentDynamicFixtures,
  ProductCategoryAssignmentStaticFixtures,
} from '@interfaces/backoffice';
import { ProductCategoryAssignPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'product category assignment',
  { tags: ['@backoffice', '@product-category', 'product-category', 'spryker-product-category', 'spryker-core'] },
  (): void => {
    const productCategoryAssignPage = container.get(ProductCategoryAssignPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: ProductCategoryAssignmentStaticFixtures;
    let dynamicFixtures: ProductCategoryAssignmentDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('should assign a product to a category', (): void => {
      productCategoryAssignPage.visitAssignPage(dynamicFixtures.category.id_category);

      productCategoryAssignPage.assignProduct({
        idProductAbstract: dynamicFixtures.productToAssign.fk_product_abstract,
        searchTerm: dynamicFixtures.productToAssign.abstract_sku,
      });

      productCategoryAssignPage.assertAssignmentSuccess(dynamicFixtures.productToAssign.fk_product_abstract);
    });

    it('should deassign a product from a category', (): void => {
      productCategoryAssignPage.visitAssignPage(dynamicFixtures.category.id_category);

      productCategoryAssignPage.deassignProduct({
        idProductAbstract: dynamicFixtures.productToDeassign.fk_product_abstract,
      });

      productCategoryAssignPage.assertDeassignmentSuccess();
    });
  }
);
