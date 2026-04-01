import { container } from '@utils';
import { retryableBefore } from '../../../support/e2e';
import { ProductAttributeVisibilityDynamicFixtures, ProductAttributeVisibilityStaticFixtures } from '@interfaces/yves';
import { ProductAttributeVisibilityEditPage } from '@pages/backoffice';
import { ProductAttributeVisibilityPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'product attribute visibility on storefront',
  { tags: ['@yves', '@product', 'catalog', 'cart', 'spryker-core'] },
  (): void => {
    const editPage = container.get(ProductAttributeVisibilityEditPage);
    const attributeVisibilityPage = container.get(ProductAttributeVisibilityPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: ProductAttributeVisibilityStaticFixtures;
    let dynamicFixtures: ProductAttributeVisibilityDynamicFixtures;

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      editPage.updateAttributeVisibility(staticFixtures.attributeKey, ['PDP', 'PLP', 'Cart']);
      cy.runQueueWorker();

      attributeVisibilityPage.visitSearchAndWaitForProduct(dynamicFixtures.product.abstract_sku);
    });

    it('Should display attribute badges', (): void => {
      attributeVisibilityPage.visitSearchAndWaitForProduct(dynamicFixtures.product.abstract_sku);
      attributeVisibilityPage.assertPlpAttributeBadgeVisible(staticFixtures.attributeValue);

      attributeVisibilityPage.navigateToProductDetailPage(dynamicFixtures.product.abstract_sku);
      attributeVisibilityPage.assertPdpAttributeVisible(staticFixtures.attributeValue);

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      attributeVisibilityPage.assertCartAttributeBadgeVisible(staticFixtures.attributeValue);
    });

    it('Should NOT show attribute badge (except PDP)', (): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      editPage.updateAttributeVisibility(staticFixtures.attributeKey, ['PDP']);
      cy.runQueueWorker();

      attributeVisibilityPage.visitSearchAndWaitForProduct(dynamicFixtures.product.abstract_sku);
      attributeVisibilityPage.assertPlpAttributeBadgeNotVisible(staticFixtures.attributeValue);

      attributeVisibilityPage.navigateToProductDetailPage(dynamicFixtures.product.abstract_sku);
      attributeVisibilityPage.assertPdpAttributeVisible(staticFixtures.attributeValue);

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      attributeVisibilityPage.assertCartAttributeBadgeNotVisible(staticFixtures.attributeValue);
    });

    it('Should not show internal attribute', (): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      editPage.updateAttributeVisibility(staticFixtures.attributeKey, []);
      cy.runQueueWorker();

      attributeVisibilityPage.navigateToProductDetailPage(dynamicFixtures.product.abstract_sku);
      attributeVisibilityPage.assertPdpAttributeNotVisible(staticFixtures.attributeValue);

      attributeVisibilityPage.visitSearchAndWaitForProduct(dynamicFixtures.product.abstract_sku);
      attributeVisibilityPage.assertPlpAttributeBadgeNotVisible(staticFixtures.attributeValue);

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      attributeVisibilityPage.assertCartAttributeBadgeNotVisible(staticFixtures.attributeValue);
    });
  }
);
