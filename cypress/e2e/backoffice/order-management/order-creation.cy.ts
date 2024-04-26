import { container } from '@utils';
import { OrderCreationDynamicFixtures, OrderManagementStaticFixtures } from '@interfaces/backoffice';
import { SalesIndexPage } from '@pages/backoffice';
import { CartPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

describe('order creation', { tags: ['@order-management'] }, (): void => {
  const cartPage = container.get(CartPage);
  const salesIndexPage = container.get(SalesIndexPage);
  const loginCustomerScenario = container.get(CustomerLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: OrderManagementStaticFixtures;
  let dynamicFixtures: OrderCreationDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('should be able to create an order by existing customer', (): void => {
    loginCustomerScenario.execute({ email: dynamicFixtures.customer.email, password: staticFixtures.defaultPassword });

    checkoutScenario.execute({
      isGuest: false,
      isMultiShipment: false,
      idCustomerAddress: dynamicFixtures.address.id_customer_address,
      shouldTriggerOmsInCli: true,
    });
    cy.contains('Your order has been placed successfully!');

    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    salesIndexPage.visit();
    salesIndexPage.view();

    cy.get('body').contains(dynamicFixtures.product.name);
  });

  it('should be able to create an order by guest', (): void => {
    cartPage.visit();
    cartPage.quickAddToCart({ sku: dynamicFixtures.product.sku, quantity: 1 });

    checkoutScenario.execute({ isGuest: true, shouldTriggerOmsInCli: true });
    cy.contains('Your order has been placed successfully!');

    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    salesIndexPage.visit();
    salesIndexPage.view();

    cy.get('body').contains(dynamicFixtures.product.name);
  });
});
