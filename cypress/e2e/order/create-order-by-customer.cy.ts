import { LoginCustomerScenario } from '../../support/scenarios/login-customer-scenario';
import { OrderFixtures } from '../../support';
import { RegisterCustomerScenario } from '../../support/scenarios/register-customer-scenario';
import { PlaceCustomerOrderScenario } from '../../support/scenarios/place-customer-order-scenario';
import { container } from '../../support/utils/inversify.config';

describe('create order by customer', (): void => {
  beforeEach((): void => {
    cy.resetCookies();
  });

  it('should be able to create an order by new registered customer', (): void => {
    const customer = container.get(RegisterCustomerScenario).execute();
    container.get(LoginCustomerScenario).execute(customer);

    cy.fixture('order').then((fixtures: OrderFixtures) => {
      container
        .get(PlaceCustomerOrderScenario)
        .execute(fixtures.concreteProductSkus);
    });

    cy.contains('Your order has been placed successfully!');
  });

  it('should be able to create an order by existing customer [@regression]', (): void => {
    cy.fixture('order').then((fixtures: OrderFixtures) => {
      container.get(LoginCustomerScenario).execute(fixtures.customer);
      container
        .get(PlaceCustomerOrderScenario)
        .execute(fixtures.concreteProductSkus);
    });

    cy.contains('Your order has been placed successfully!');
  });
});
