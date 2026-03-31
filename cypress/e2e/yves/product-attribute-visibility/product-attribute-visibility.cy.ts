import { container } from '@utils';
import { retryableBefore } from '../../../support/e2e';
import { ProductAttributeVisibilityEditPage } from '@pages/backoffice';
import { ProductAttributeVisibilityPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'product attribute visibility on storefront',
  { tags: ['@yves', '@product-attribute', 'product-attribute', 'catalog', 'cart', 'spryker-core'] },
  (): void => {
    const editPage = container.get(ProductAttributeVisibilityEditPage);
    const attributeVisibilityPage = container.get(ProductAttributeVisibilityPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    interface StaticFixtures {
      defaultPassword: string;
      attributeKey: string;
      attributeValue: string;
    }

    interface DynamicFixtures {
      rootUser: { username: string };
      customer: { email: string };
      product: {
        sku: string;
        abstract_sku: string;
        localized_attributes: Array<{ name: string }>;
      };
    }

    let staticFixtures: StaticFixtures;
    let dynamicFixtures: DynamicFixtures;

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

    describe('PLP attribute badges', (): void => {
      it('should display attribute badges on product listing page', (): void => {
        attributeVisibilityPage.visitSearchAndWaitForProduct(dynamicFixtures.product.abstract_sku);

        attributeVisibilityPage.assertPlpAttributeBadgeVisible(staticFixtures.attributeValue);
      });
    });

    describe('PDP attribute visibility', (): void => {
      it('should display PDP-visible attributes on product detail page', (): void => {
        attributeVisibilityPage.navigateToProductDetailPage(dynamicFixtures.product.abstract_sku);

        attributeVisibilityPage.assertPdpAttributeVisible(staticFixtures.attributeValue);
      });
    });

    describe('Cart attribute badges', (): void => {
      it('should display attribute badges on cart page', (): void => {
        customerLoginScenario.execute({
          email: dynamicFixtures.customer.email,
          password: staticFixtures.defaultPassword,
        });

        attributeVisibilityPage.assertCartAttributeBadgeVisible(staticFixtures.attributeValue);
      });
    });

    describe('Removing PLP and Cart visibility', (): void => {
      retryableBefore((): void => {
        userLoginScenario.execute({
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });

        editPage.updateAttributeVisibility(staticFixtures.attributeKey, ['PDP']);
        cy.runQueueWorker();
      });

      it('should not show attribute badge on PLP', (): void => {
        attributeVisibilityPage.visitSearchAndWaitForProduct(dynamicFixtures.product.abstract_sku);

        attributeVisibilityPage.assertPlpAttributeBadgeNotVisible(staticFixtures.attributeValue);
      });

      it('should still show attribute on PDP', (): void => {
        attributeVisibilityPage.navigateToProductDetailPage(dynamicFixtures.product.abstract_sku);

        attributeVisibilityPage.assertPdpAttributeVisible(staticFixtures.attributeValue);
      });

      it('should not show attribute badge on cart page', (): void => {
        customerLoginScenario.execute({
          email: dynamicFixtures.customer.email,
          password: staticFixtures.defaultPassword,
        });

        attributeVisibilityPage.assertCartAttributeBadgeNotVisible(staticFixtures.attributeValue);
      });
    });

    describe('Removing all visibility', (): void => {
      retryableBefore((): void => {
        userLoginScenario.execute({
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });

        editPage.updateAttributeVisibility(staticFixtures.attributeKey, []);
        cy.runQueueWorker();
      });

      it('should not show attribute on PDP', (): void => {
        attributeVisibilityPage.navigateToProductDetailPage(dynamicFixtures.product.abstract_sku);

        attributeVisibilityPage.assertPdpAttributeNotVisible(staticFixtures.attributeValue);
      });
    });
  }
);
