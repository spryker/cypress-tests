import { container } from '@utils';
import { CheckoutStaticFixtures, BasicCheckoutDynamicFixtures } from '@interfaces/yves';
import { CartPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

describe('basic checkout', { tags: ['@checkout'] }, (): void => {
  const cartPage = container.get(CartPage);
  const loginCustomerScenario = container.get(CustomerLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);

  let staticFixtures: CheckoutStaticFixtures;
  let dynamicFixtures: BasicCheckoutDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('guest customer should checkout to single shipment', (): void => {
    cartPage.visit();
    cartPage.quickAddToCart({ sku: dynamicFixtures.product1.sku, quantity: 1 });
    cartPage.quickAddToCart({ sku: dynamicFixtures.product2.sku, quantity: 1 });

    checkoutScenario.execute({ isGuest: true });

    cy.contains('Your order has been placed successfully!');
  });

  it('guest customer should checkout to multi shipment address', { tags: ['@smoke'] }, (): void => {
    cartPage.visit();
    cartPage.quickAddToCart({ sku: dynamicFixtures.product1.sku, quantity: 1 });
    cartPage.quickAddToCart({ sku: dynamicFixtures.product2.sku, quantity: 1 });

    checkoutScenario.execute({
      isGuest: true,
      isMultiShipment: true,
    });

    cy.contains('Your order has been placed successfully!');
  });

  it('customer should checkout to single shipment (with customer shipping address)', (): void => {
    loginCustomerScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    checkoutScenario.execute({ idCustomerAddress: dynamicFixtures.address.id_customer_address });

    cy.contains('Your order has been placed successfully!');
  });

  it('customer should checkout to single shipment (with new shipping address)', (): void => {
    loginCustomerScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });

    checkoutScenario.execute();

    cy.contains('Your order has been placed successfully!');
  });

  it(
    'customer should checkout to multi shipment address (with customer shipping address)',
    { tags: ['@smoke'] },
    (): void => {
      loginCustomerScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      checkoutScenario.execute({
        isMultiShipment: true,
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
      });

      cy.contains('Your order has been placed successfully!');
    }
  );

  it(
    'customer should checkout to multi shipment address (with new shipping address)',
    { tags: ['@smoke'] },
    (): void => {
      loginCustomerScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      checkoutScenario.execute({ isMultiShipment: true });

      cy.contains('Your order has been placed successfully!');
    }
  );
});
