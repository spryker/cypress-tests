import { CheckoutStaticFixtures, CheckoutSuite1DynamicFixtures } from '@intefaces/yves';
import { CartPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import { container } from '@utils';

describe('checkout suite 1', { tags: ['@checkout'] }, (): void => {
  const cartPage = container.get(CartPage);
  const loginCustomerScenario = container.get(CustomerLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);

  let staticFixtures: CheckoutStaticFixtures;
  let dynamicFixtures: CheckoutSuite1DynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('guest customer should checkout to single shipment', (): void => {
    cartPage.visit();
    cartPage.quickAddToCart(dynamicFixtures.product1.sku, 1);
    cartPage.quickAddToCart(dynamicFixtures.product2.sku, 1);

    checkoutScenario.execute(true);

    cy.contains('Your order has been placed successfully!');
  });

  it('guest customer should checkout to multi shipment address', { tags: ['@smoke'] }, (): void => {
    cartPage.visit();
    cartPage.quickAddToCart(dynamicFixtures.product1.sku, 1);
    cartPage.quickAddToCart(dynamicFixtures.product2.sku, 1);

    checkoutScenario.execute(true, true);

    cy.contains('Your order has been placed successfully!');
  });

  it('customer should checkout to single shipment (with customer shipping address)', (): void => {
    loginCustomerScenario.execute(dynamicFixtures.customer.email, staticFixtures.defaultPassword);

    checkoutScenario.execute(false, false, dynamicFixtures.address.id_customer_address);

    cy.contains('Your order has been placed successfully!');
  });

  it('customer should checkout to single shipment (with new shipping address)', (): void => {
    loginCustomerScenario.execute(dynamicFixtures.customer.email, staticFixtures.defaultPassword);

    checkoutScenario.execute(false, false);

    cy.contains('Your order has been placed successfully!');
  });

  it(
    'customer should checkout to multi shipment address (with customer shipping address)',
    { tags: ['@smoke'] },
    (): void => {
      loginCustomerScenario.execute(dynamicFixtures.customer.email, staticFixtures.defaultPassword);

      checkoutScenario.execute(false, true, dynamicFixtures.address.id_customer_address);

      cy.contains('Your order has been placed successfully!');
    }
  );

  it(
    'customer should checkout to multi shipment address (with new shipping address)',
    { tags: ['@smoke'] },
    (): void => {
      loginCustomerScenario.execute(dynamicFixtures.customer.email, staticFixtures.defaultPassword);

      checkoutScenario.execute(false, true);

      cy.contains('Your order has been placed successfully!');
    }
  );
});
