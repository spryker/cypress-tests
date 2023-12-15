import { OrderFixtures } from '../../support';
import { PlaceGuestOrderScenario } from '../../support/scenarios/place-guest-order-scenario';
import { container } from '../../support/utils/inversify.config';

describe('create order by guest', (): void => {
  beforeEach((): void => {
    cy.resetCookies();
  });

  it('should be able to create an order by guest [@regression]', (): void => {
    cy.fixture('order').then((fixtures: OrderFixtures) => {
      container
        .get(PlaceGuestOrderScenario)
        .execute(fixtures.concreteProductSkus);
    });

    cy.contains('Your order has been placed successfully!');
  });
});
