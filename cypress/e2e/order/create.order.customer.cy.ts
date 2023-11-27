import {PlaceDummyOrderScenario} from "../../support/scenarios/place.dummy.order.scenario";
import {LoginAsCustomerScenario} from "../../support/scenarios/login.as.customer.scenario";

describe('Create order', () => {
    beforeEach(() => {
        cy.resetCookies();
    });

    it('new registered customer should be able to create an order', () => {
        LoginAsCustomerScenario.execute();
        PlaceDummyOrderScenario.execute();

        cy.contains('Your order has been placed successfully!');
    });

    it('existing registered customer should be able to create an order', () => {
        LoginAsCustomerScenario.execute('spencor.hopkin@spryker.com', 'change123');
        PlaceDummyOrderScenario.execute();

        cy.contains('Your order has been placed successfully!');
    });
});
