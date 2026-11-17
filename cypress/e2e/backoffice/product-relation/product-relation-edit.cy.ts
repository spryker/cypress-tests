import { container } from '@utils';
import { ProductRelationEditDynamicFixtures, ProductRelationEditStaticFixtures } from '@interfaces/backoffice';
import { ProductRelationPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'product relation edit',
  { tags: ['@backoffice', 'product-relation', 'up-selling', 'spryker-core'] },
  (): void => {
    const productRelationPage = container.get(ProductRelationPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: ProductRelationEditStaticFixtures;
    let dynamicFixtures: ProductRelationEditDynamicFixtures;

    const relationKey = `up-selling-${Math.random().toString(36).substring(2, 8)}`;
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

    it('should update the product rule of a product relation and save it', (): void => {
      const ruleQueryTableAlias = productRelationPage.interceptRuleQueryTable('edit');

      productRelationPage.createProductRelation({
        key: relationKey,
        relationType: relatedProductsRelationType,
        baseProductSearch: dynamicFixtures.baseProduct.abstract_sku,
        relatedProductSku: dynamicFixtures.relatedProduct.abstract_sku,
      });
      productRelationPage.getEditRelationHeading(relationKey).should('be.visible');

      productRelationPage.updateProductRuleValue(dynamicFixtures.updatedRelatedProduct.abstract_sku);

      productRelationPage.getRuleQueryTable().should('contain', dynamicFixtures.updatedRelatedProduct.abstract_sku);
      productRelationPage.getRuleQueryTableRequests(ruleQueryTableAlias).should((interceptions): void => {
        expect(interceptions).not.to.be.empty;
        interceptions.forEach((interception): void => {
          expect(interception.response?.statusCode).to.equal(200);
        });
      });

      productRelationPage.saveProductRelation();

      productRelationPage.getSuccessMessage().should('contain', 'Product relation successfully modified');
    });
  }
);
