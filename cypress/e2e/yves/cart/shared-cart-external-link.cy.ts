import { container } from '@utils';
import { SharedCartExternalLinkDynamicFixtures, SharedCartExternalLinkStaticFixtures } from '@interfaces/yves';
import { CartPage } from '@pages/yves';
import { CustomerLoginScenario, CustomerLogoutScenario } from '@scenarios/yves';

describe(
  'shared cart external link',
  { tags: ['@yves', '@cart', 'cart', 'shared-carts', 'multiple-carts', 'spryker-core'] },
  (): void => {
    // Sharing a cart by link is a multiple-carts feature, which the B2C storefronts do not carry.
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the B2C storefronts have no shared carts', () => {});

      return;
    }

    const cartPage = container.get(CartPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerLogoutScenario = container.get(CustomerLogoutScenario);

    let staticFixtures: SharedCartExternalLinkStaticFixtures;
    let dynamicFixtures: SharedCartExternalLinkDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a cart shared by external link when an anonymous visitor opens it then the cart is shown as a read-only preview', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      cartPage.visit();

      // Act
      cartPage.getExternalCartShareLink().then((externalCartShareLink: string) => {
        // The point of the external link is that it works for someone who is not signed in.
        customerLogoutScenario.execute();
        cy.visit(externalCartShareLink);

        // Assert
        cartPage.assertBodyContainsText(`${staticFixtures.cartPreviewTitlePrefix} ${dynamicFixtures.quote.name}`);
        cartPage.assertBodyContainsText(dynamicFixtures.product1.sku);
      });
    });
  }
);
