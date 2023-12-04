import { OrderFixtures } from '../../support';
import { PlaceGuestOrderScenario } from '../../support/scenarios/place-guest-order-scenario';

describe('create order by guest', () => {
  beforeEach(() => {
    cy.resetCookies();
  });

  it('should be able to create an order by guest [@regression]', () => {
    cy.fixture('order').then((fixtures: OrderFixtures) => {
      PlaceGuestOrderScenario.execute(fixtures.concreteProductSkus);
    });

    cy.contains('Your order has been placed successfully!');
  });
});
