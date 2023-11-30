import { RegisterCustomerScenario } from "../../support/scenarios/customer/register-customer.scenario";
import { LoginCustomerScenario } from "../../support/scenarios/customer/login-customer.scenario";
import { CreateMultiCartScenario } from "../../support/scenarios/cart/create-multi-cart.scenario";
import { PlaceCustomerOrderScenario } from "../../support/scenarios/order/place-customer-order.scenario";

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
    LoginCustomerScenario.execute(customer.email, customer.password);
    CreateMultiCartScenario.execute();

    PlaceCustomerOrderScenario.execute([fixtures.concreteProductSkus[0]]);

    cy.contains("Your order has been placed successfully!");
  });

  it("should be able to create an order by existing customer", () => {
    LoginCustomerScenario.execute(
      fixtures.customer.email,
      fixtures.customer.password,
    );
    CreateMultiCartScenario.execute();
    PlaceCustomerOrderScenario.execute(fixtures.concreteProductSkus);

    cy.contains("Your order has been placed successfully!");
  });
});
