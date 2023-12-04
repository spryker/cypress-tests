import { LoginCustomerScenario } from '../../support/scenarios/login-customer-scenario';
import { OrderFixtures } from '../../support';
import { RegisterCustomerScenario } from '../../support/scenarios/register-customer-scenario';
import { PlaceCustomerOrderScenario } from '../../support/scenarios/place-customer-order-scenario';

describe('create order by customer', () => {
  beforeEach(() => {
    cy.resetCookies();
  });

  it('should be able to create an order by new registered customer', () => {
    LoginCustomerScenario.execute(RegisterCustomerScenario.execute());

    cy.fixture('order').then((fixtures: OrderFixtures) => {
      PlaceCustomerOrderScenario.execute(fixtures.concreteProductSkus);
    });

    cy.contains('Your order has been placed successfully!');
  });

  it('should be able to create an order by existing customer', () => {
    cy.fixture('order').then((fixtures: OrderFixtures) => {
      LoginCustomerScenario.execute(fixtures.customer);
      PlaceCustomerOrderScenario.execute(fixtures.concreteProductSkus);
    });

    cy.contains('Your order has been placed successfully!');
  });
});
