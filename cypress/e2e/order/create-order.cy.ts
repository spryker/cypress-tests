import {PlaceDummyOrderScenario} from "../../support/scenarios/place.dummy.order.scenario";
import {LoginAsCustomerScenario} from "../../support/scenarios/login.as.customer.scenario";

describe('Create order', () => {
    let fixtures: OrderFixtures;

    before(() => {
        cy.fixture('checkout/data').then((data: OrderFixtures) => fixtures = data);
    });

    beforeEach(() => {
        cy.resetCookies();
    });

    it('new registered customer should be able to create an order', () => {
        LoginAsCustomerScenario.execute();
        PlaceDummyOrderScenario.execute([fixtures.concreteProductSkus[0]]);

        cy.contains('Your order has been placed successfully!');
    });

    it('existing customer should be able to create an order', () => {
        LoginAsCustomerScenario.execute(fixtures.customer.email, fixtures.customer.password);
        PlaceDummyOrderScenario.execute([
            fixtures.concreteProductSkus[0],
            fixtures.concreteProductSkus[1]
        ]);

        cy.contains('Your order has been placed successfully!');
    });
});
