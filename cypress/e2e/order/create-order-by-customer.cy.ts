import { RegisterCustomerScenario } from "../../support/scenarios/customer/register-customer.scenario";
import { PlaceCustomerOrderScenario } from "../../support/scenarios/order/place-customer-order.scenario";
import { LoginAsCustomerWithNewCartScenario } from "../../support/scenarios/cart/login-as-customer-with-new-cart.scenario";

describe("create order by customer", () => {
  let fixtures: OrderFixtures;

  before(() => {
    cy.fixture("checkout/data").then(
      (data: OrderFixtures) => (fixtures = data),
    );
  });

  beforeEach(() => {
    cy.resetCookies();
  });

  it("should be able to create an order by new registered customer", () => {
    const customer = RegisterCustomerScenario.execute();
    LoginAsCustomerWithNewCartScenario.execute(
      customer.email,
      customer.password,
    );
    PlaceCustomerOrderScenario.execute(fixtures.concreteProductSkus);

    cy.contains("Your order has been placed successfully!");
  });

  it("should be able to create an order by existing customer", () => {
    LoginAsCustomerWithNewCartScenario.execute(
      fixtures.customer.email,
      fixtures.customer.password,
    );
    PlaceCustomerOrderScenario.execute(fixtures.concreteProductSkus);

    cy.contains("Your order has been placed successfully!");
  });
});
