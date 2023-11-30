import { RegisterCustomerScenario } from "../../support/scenarios/customer/register-customer.scenario";
import { PlaceCustomerOrderScenario } from "../../support/scenarios/order/place-customer-order.scenario";
import { LoginPage } from "../../support/pages/backoffice/login/login.page";
import { SalesPage } from "../../support/pages/backoffice/sales/sales.page";
import { LoginCustomerScenario } from "../../support/scenarios/customer/login-customer.scenario";
import { DetailPage } from "../../support/pages/backoffice/sales/detail/detail.page";
import { CreatePage } from "../../support/pages/backoffice/sales-return-gui/create/create.page";

describe("create return by user", () => {
  const loginPage = new LoginPage();
  const salesPage = new SalesPage();
  const salesDetailPage = new DetailPage();
  const createReturnPage = new CreatePage();

  let fixtures: ReturnFixtures;
  let customer: any;

  before(() => {
    cy.fixture("return/data").then((data: ReturnFixtures) => (fixtures = data));
  });

  beforeEach(() => {
    cy.resetCookies();

    customer = RegisterCustomerScenario.execute();
    LoginCustomerScenario.execute(customer.email, customer.password);
    PlaceCustomerOrderScenario.execute(fixtures.concreteProductSkus);
  });

  // ignore uncaught exceptions
  Cypress.on("uncaught:exception", (err) => {
    return false;
  });

  it("should be able to create return from Backoffice (from shipped order state)", () => {
    loginPage.login(fixtures.user.email, fixtures.user.password);
    salesPage.viewLastPlacedOrder();

    salesDetailPage.triggerOms("Pay");
    salesDetailPage.triggerOms("Skip timeout");
    salesDetailPage.triggerOms("skip picking");
    salesDetailPage.triggerOms('Ship');

    salesDetailPage.createReturn();
    createReturnPage.createReturnForAllOrderItems();

    cy.contains("Return was successfully created.");
  });

  it("should be able to create return from Backoffice (from delivery order state)", () => {
    loginPage.login(fixtures.user.email, fixtures.user.password);
    salesPage.viewLastPlacedOrder();

    salesDetailPage.triggerOms("Pay");
    salesDetailPage.triggerOms("Skip timeout");
    salesDetailPage.triggerOms("skip picking");
    salesDetailPage.triggerOms("Ship");
    salesDetailPage.triggerOms("Stock update");

    salesDetailPage.createReturn();
    createReturnPage.createReturnForAllOrderItems();

    cy.contains("Return was successfully created.");
  });
});
