import {PlaceGuestOrderScenario} from "../../support/scenarios/order/place-guest-order.scenario";

describe('create order by guest', () => {
    let fixtures: OrderFixtures;

    before(() => {
        cy.fixture('checkout/data').then((data: OrderFixtures) => fixtures = data);
    });

    beforeEach(() => {
        cy.resetCookies();
    });

    it('should be able to create an order by guest', () => {
        PlaceGuestOrderScenario.execute([
            fixtures.concreteProductSkus[0],
            fixtures.concreteProductSkus[1],
        ]);

        cy.contains('Your order has been placed successfully!');
    });
});
