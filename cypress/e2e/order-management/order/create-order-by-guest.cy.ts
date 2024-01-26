import { container } from '../../../support/utils/inversify/inversify.config';
import { PlaceGuestOrderScenario } from '../../../support/scenarios/yves/place-guest-order-scenario';

describe('create order by guest', (): void => {
  let fixtures: CreateOrderByGuestFixtures;
  let placeGuestOrderScenario: PlaceGuestOrderScenario;

  beforeEach((): void => {
    cy.resetYvesCookies();
  });

  before((): void => {
    fixtures = Cypress.env('fixtures');
    placeGuestOrderScenario = container.get(PlaceGuestOrderScenario);
  });

  it('should be able to create an order by guest', (): void => {
    placeGuestOrderScenario.execute(fixtures.concreteProductSkus);

    cy.contains('Your order has been placed successfully!');
  });
});
