import { container } from '@utils';
import { ProductRelationCreateDynamicFixtures, ProductRelationCreateStaticFixtures } from '@interfaces/backoffice';
import { ProductRelationPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'product relation create',
  { tags: ['@backoffice', 'product-relation', 'up-selling', 'spryker-core'] },
  (): void => {
    const productRelationPage = container.get(ProductRelationPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: ProductRelationCreateStaticFixtures;
    let dynamicFixtures: ProductRelationCreateDynamicFixtures;

    // Relation keys are made run-unique so repeated CI runs never collide on the
    // "already exists" validation. The Codeception original relied on an explicit
    // cleanup step that deleted the created row; Cypress has no equivalent DB access here.
    const relationKey = `up-selling-${Math.random().toString(36).substring(2, 8)}`;

    // The relation-type dropdown value ("Related products" plugin). Confirmed only
    // against the Codeception source constant ProductRelationTypes::TYPE_RELATED_PRODUCTS.
    const relatedProductsRelationType = 'related-products';

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('should create a product relation and land on the edit page', (): void => {
      productRelationPage.createProductRelation({
        key: relationKey,
        relationType: relatedProductsRelationType,
        baseProductSearch: dynamicFixtures.baseProduct.abstract_sku,
        relatedProductSku: dynamicFixtures.relatedProduct.sku,
      });

      productRelationPage.assertRelationSaved(relationKey);
    });
  }
);
