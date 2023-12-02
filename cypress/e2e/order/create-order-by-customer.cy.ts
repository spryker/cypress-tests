import { RegisterCustomerScenario } from '../../support/scenarios/customer/register-customer.scenario';
import { PlaceCustomerOrderScenario } from '../../support/scenarios/order/place-customer-order.scenario';
import { LoginAsCustomerWithNewCartScenario } from '../../support/scenarios/cart/login-as-customer-with-new-cart.scenario';
import { OrderFixtures } from '../../support';

describe('create order by customer', () => {
  beforeEach(() => {
    cy.resetCookies();
  });

  it('should be able to create an order by new registered customer', () => {
    const customer = RegisterCustomerScenario.execute();
    LoginAsCustomerWithNewCartScenario.execute(customer);

    cy.fixture('order').then((fixtures: OrderFixtures) => {
      PlaceCustomerOrderScenario.execute(fixtures.concreteProductSkus);
    });

    cy.contains('Your order has been placed successfully!');
  });

  it('should be able to create an order by existing customer', () => {
    cy.fixture('order').then((fixtures: OrderFixtures) => {
      LoginAsCustomerWithNewCartScenario.execute(fixtures.customer);
      PlaceCustomerOrderScenario.execute(fixtures.concreteProductSkus);
    });

    cy.contains('Your order has been placed successfully!');
  });
});
