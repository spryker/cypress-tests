import { PlaceGuestOrderScenario } from '../../support/scenarios/order/place-guest-order.scenario';
import { OrderFixtures } from '../../support';

describe('create order by guest', () => {
  beforeEach(() => {
    cy.resetCookies();
  });

  it('should be able to create an order by guest', () => {
    cy.fixture('order').then((fixtures: OrderFixtures) => {
      PlaceGuestOrderScenario.execute(fixtures.concreteProductSkus);
    });

    cy.contains('Your order has been placed successfully!');
  });
});
