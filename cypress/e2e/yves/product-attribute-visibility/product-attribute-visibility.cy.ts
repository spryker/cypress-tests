import { container } from '@utils';
import { retryableBefore } from '../../../support/e2e';
import { ProductAttributeVisibilityDynamicFixtures, ProductAttributeVisibilityStaticFixtures } from '@interfaces/yves';
import { ProductAttributeVisibilityEditPage } from '@pages/backoffice';
import { ProductAttributeVisibilityPage, ProductPage } from '@pages/yves';
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
    const productPage = container.get(ProductPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    const suiteOnlyIt = (description: string, testFunction: () => void): void => {
      (Cypress.env('repositoryId') === 'suite' ? it : it.skip)(description, testFunction);
    };

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

      attributeVisibilityPage.visitSearchAndWaitForProduct(dynamicFixtures.product.abstract_sku);
    });

    it('Should display attribute badges', (): void => {
      // This arrange must stay inside the test: retryableBefore re-runs before every retry
      // of any test in this spec, and re-setting PDP+PLP+Cart there enqueues the opposite
      // visibility toggle between the attempts of the "NOT show" test — under a slow publish
      // pipeline the storefront then stays one delivery behind for all its retries.
      updateAttributeVisibility(staticFixtures.attributeKey, ['PDP', 'PLP', 'Cart']);
      cy.runQueueWorker();

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

    suiteOnlyIt(
      'customer should only be offered super attribute values that lead to an existing product variant',
      (): void => {
        const { url, selectedAttribute, unselectedAttribute } = staticFixtures.variantProduct;
        const valuesNotCombinable = unselectedAttribute.allValues.filter(
          (value) => !unselectedAttribute.combinableValues.includes(value)
        );

        productPage.visitProductDetailPage({ url: url });

        productPage
          .getVariantAttributeOptions(selectedAttribute.key)
          .should('have.length', selectedAttribute.allValues.length);

        productPage.selectVariantAttribute({
          attributeKey: selectedAttribute.key,
          attributeValue: selectedAttribute.selectedValue,
        });

        productPage
          .getVariantAttributeOptions(unselectedAttribute.key)
          .should('have.length', unselectedAttribute.combinableValues.length)
          .then(($options: JQuery<HTMLOptionElement>) => {
            const offeredValues = $options.toArray().map((option) => option.textContent?.trim());

            expect(offeredValues).to.deep.equal(unselectedAttribute.combinableValues);
            valuesNotCombinable.forEach((value) => expect(offeredValues).to.not.include(value));
          });

        productPage.selectVariantAttribute({
          attributeKey: unselectedAttribute.key,
          attributeValue: unselectedAttribute.selectedValue,
        });

        productPage.getAddToCartButton().should('be.enabled');

        productPage.selectVariantAttribute({
          attributeKey: selectedAttribute.key,
          attributeValue: selectedAttribute.alternativeValue,
        });

        productPage
          .getVariantAttributeSelectedValue(unselectedAttribute.key)
          .should('equal', unselectedAttribute.selectedValue);

        productPage
          .getVariantAttributeOptions(unselectedAttribute.key)
          .should('have.length', unselectedAttribute.combinableValues.length)
          .then(($options: JQuery<HTMLOptionElement>) => {
            const offeredValues = $options.toArray().map((option) => option.textContent?.trim());

            expect(offeredValues).to.deep.equal(unselectedAttribute.combinableValues);
            valuesNotCombinable.forEach((value) => expect(offeredValues).to.not.include(value));
          });

        productPage.addToCart();
        productPage.assertBodyContainsText(productPage.getAddToCartSuccessMessage());
      }
    );
  }
);
