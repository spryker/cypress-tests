import { RegisterCustomerScenario } from "../../support/scenarios/customer/register-customer.scenario";
import { PlaceCustomerOrderScenario } from "../../support/scenarios/order/place-customer-order.scenario";
import { LoginPage } from "../../support/pages/backoffice/login/login.page";
import { SalesPage } from "../../support/pages/backoffice/sales/sales.page";
import { LoginCustomerScenario } from "../../support/scenarios/customer/login-customer.scenario";

describe('create return by user', () => {
    it('should be able to create return from Backoffice by existing admin user', () => {
        const loginPage = new LoginPage();
        const salesPage = new SalesPage();

        // const customer = RegisterCustomerScenario.execute();
        // LoginCustomerScenario.execute(customer.email, customer.password);
        // PlaceCustomerOrderScenario.execute(['159_29885260']);

        loginPage.login('admin@spryker.com', 'change123');
        // salesPage.filterOrdersByEmail(customer.email);
        salesPage.viewLastPlacedOrder();
        // cy.contains(`/\w+/oms/trigger/submit-trigger-event-for-order?event=pay\w+/`).click();
        // cy.get('#oms_trigger_form_submit').filter(':contains("Pay")');
    });
});