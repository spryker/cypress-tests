import { container } from '@utils';
import { retryableBefore } from '../../../support/e2e';
import { ProductAttributeVisibilityDynamicFixtures, ProductAttributeVisibilityStaticFixtures } from '@interfaces/yves';
import { ProductAttributeVisibilityEditPage } from '@pages/backoffice';
import { ProductAttributeVisibilityPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'product attribute visibility on storefront',
  { tags: ['@yves', 'product', 'catalog', 'cart', 'spryker-core'] },
  (): void => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b-mp', () => {});
      return;
    }

    const editPage = container.get(ProductAttributeVisibilityEditPage);
    const attributeVisibilityPage = container.get(ProductAttributeVisibilityPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    const updateAttributeVisibility = (attributeKey: string, visibilityTypes: string[]): void => {
      editPage.visit();

      editPage.getTableBodyRows().should('be.visible');
      editPage.getSearchInput().should('be.visible').type(`{selectall}${attributeKey}`);

      editPage.getTableBodyRows().should(($tbody) => {
        const text = $tbody.text();
        expect(text.includes(attributeKey)).to.be.true;
      });

      editPage.getTableBodyRows().first().contains('Edit').click();

      editPage.getVisibilityTypesSelect().invoke('val', visibilityTypes).trigger('change', { force: true });
      editPage.getSubmitButton().click();

      cy.url().should('contain', '/translate');
    };

    let staticFixtures: ProductAttributeVisibilityStaticFixtures;
    let dynamicFixtures: ProductAttributeVisibilityDynamicFixtures;

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      updateAttributeVisibility(staticFixtures.attributeKey, ['PDP', 'PLP', 'Cart']);
      cy.runQueueWorker();

      attributeVisibilityPage.visitSearchAndWaitForProduct(dynamicFixtures.product.abstract_sku);
    });

    it('Should display attribute badges', (): void => {
      attributeVisibilityPage.visitSearchAndWaitForBadgeVisible(
        dynamicFixtures.product.abstract_sku,
        staticFixtures.attributeValue
      );
      attributeVisibilityPage.getFirstProductItem().within(() => {
        attributeVisibilityPage.getAttributeBadge().should('contain', staticFixtures.attributeValue);
      });

      attributeVisibilityPage.navigateToProductDetailPage(dynamicFixtures.product.abstract_sku);
      cy.url().should('not.include', '/search');
      attributeVisibilityPage.getPdpAttribute().should('contain', staticFixtures.attributeValue);

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      attributeVisibilityPage.visitCart();
      attributeVisibilityPage.getFirstCartItem().within(() => {
        attributeVisibilityPage.getAttributeBadge().should('contain', staticFixtures.attributeValue);
      });
    });

    it('Should NOT show attribute badge (except PDP)', (): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      updateAttributeVisibility(staticFixtures.attributeKey, ['PDP']);
      cy.runQueueWorker();

      attributeVisibilityPage.visitSearchAndWaitForBadgeNotVisible(
        dynamicFixtures.product.abstract_sku,
        staticFixtures.attributeValue
      );
      attributeVisibilityPage.getFirstProductItem().should('not.contain', staticFixtures.attributeValue);

      attributeVisibilityPage.navigateToProductDetailPage(dynamicFixtures.product.abstract_sku);
      cy.url().should('not.include', '/search');
      attributeVisibilityPage.getPdpAttribute().should('contain', staticFixtures.attributeValue);

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      attributeVisibilityPage.visitCart();
      attributeVisibilityPage.getFirstCartItem().should('not.contain', staticFixtures.attributeValue);
    });

    it('Should not show internal attribute', (): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      updateAttributeVisibility(staticFixtures.attributeKey, []);
      cy.runQueueWorker();

      attributeVisibilityPage.navigateToProductDetailPage(dynamicFixtures.product.abstract_sku);
      cy.url().should('not.include', '/search');
      attributeVisibilityPage.getPdpAttribute().should('not.contain', staticFixtures.attributeValue);

      attributeVisibilityPage.visitSearchAndWaitForBadgeNotVisible(
        dynamicFixtures.product.abstract_sku,
        staticFixtures.attributeValue
      );
      attributeVisibilityPage.getFirstProductItem().should('not.contain', staticFixtures.attributeValue);

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      attributeVisibilityPage.visitCart();
      attributeVisibilityPage.getFirstCartItem().should('not.contain', staticFixtures.attributeValue);
    });
  }
);
