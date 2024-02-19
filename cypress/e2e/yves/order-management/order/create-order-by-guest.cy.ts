import { container } from '../../../../support/utils/inversify/inversify.config';
import {CreateOrderByGuestDynamicFixtures} from "../../../../support/types/yves/order-managment/order";
import {PlaceGuestOrderScenario} from "../../../../support/scenarios/yves";

describe('create order by guest', (): void => {
  let dynamicFixtures: CreateOrderByGuestDynamicFixtures;
  let placeGuestOrderScenario: PlaceGuestOrderScenario;

  beforeEach((): void => {
    cy.resetYvesCookies();
  });

  before((): void => {
    dynamicFixtures = Cypress.env('dynamicFixtures');
    placeGuestOrderScenario = container.get(PlaceGuestOrderScenario);
  });

  it('should be able to create an order by guest [@regression]', (): void => {
    placeGuestOrderScenario.execute([dynamicFixtures.product.sku]);

    cy.contains('Your order has been placed successfully!');
  });
});
