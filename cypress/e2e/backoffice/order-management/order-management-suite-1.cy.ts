import { OrderManagementStaticFixtures, OrderManagementSuite1DynamicFixtures } from '@interfaces/backoffice';
import { SalesIndexPage } from '@pages/backoffice';
import { CartPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import { container } from '@utils';

describe('order management suite 1', { tags: ['@order-management'] }, (): void => {
  const cartPage = container.get(CartPage);
  const salesIndexPage = container.get(SalesIndexPage);
  const loginCustomerScenario = container.get(CustomerLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: OrderManagementStaticFixtures;
  let dynamicFixtures: OrderManagementSuite1DynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('should be able to create an order by existing customer', (): void => {
    loginCustomerScenario.execute(dynamicFixtures.customer.email, staticFixtures.defaultPassword);

    checkoutScenario.execute({
      isGuest: false,
      isMultiShipment: false,
      idCustomerAddress: dynamicFixtures.address.id_customer_address,
    });
    cy.contains('Your order has been placed successfully!');

    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);
    salesIndexPage.viewLastPlacedOrder();

    cy.get('body').contains(dynamicFixtures.product.name);
  });

  it('should be able to create an order by guest', (): void => {
    cartPage.visit();
    cartPage.quickAddToCart(dynamicFixtures.product.sku, 1);

    checkoutScenario.execute({ isGuest: true });
    cy.contains('Your order has been placed successfully!');

    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);
    salesIndexPage.viewLastPlacedOrder();

    cy.get('body').contains(dynamicFixtures.product.name);
  });
});
