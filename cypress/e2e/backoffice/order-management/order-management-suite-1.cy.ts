import { CartPage } from '../../../support/pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '../../../support/scenarios/yves';
import { container } from '../../../support/utils/inversify/inversify.config';
import {
  OrderManagementStaticFixtures,
  OrderManagementSuite1DynamicFixtures,
} from '../../../support/types/backoffice/order-managment/fixture-types';
import { UserLoginScenario } from '../../../support/scenarios/backoffice';
import { SalesIndexPage } from '../../../support/pages/backoffice';

describe('order management suite 1', { tags: ['@order-management'] }, (): void => {
  const cartPage: CartPage = container.get(CartPage);
  const salesIndexPage: SalesIndexPage = container.get(SalesIndexPage);
  const loginCustomerScenario: CustomerLoginScenario = container.get(CustomerLoginScenario);
  const checkoutScenario: CheckoutScenario = container.get(CheckoutScenario);
  const userLoginScenario: UserLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: OrderManagementStaticFixtures;
  let dynamicFixtures: OrderManagementSuite1DynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('should be able to create an order by existing customer', (): void => {
    loginCustomerScenario.execute(dynamicFixtures.customer.email, staticFixtures.defaultPassword);

    checkoutScenario.execute(false, false, dynamicFixtures.address.id_customer_address);
    cy.contains('Your order has been placed successfully!');

    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);
    salesIndexPage.viewLastPlacedOrder();

    cy.get('body').contains(dynamicFixtures.product.name);
  });

  it('should be able to create an order by guest', (): void => {
    cartPage.visit();
    cartPage.quickAddToCart(dynamicFixtures.product.sku, 1);

    checkoutScenario.execute(true);
    cy.contains('Your order has been placed successfully!');

    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);
    salesIndexPage.viewLastPlacedOrder();

    cy.get('body').contains(dynamicFixtures.product.name);
  });
});
