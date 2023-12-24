import { LoginCustomerScenario } from '../../../support/scenarios/login-customer-scenario';
import { RegisterCustomerScenario } from '../../../support/scenarios/register-customer-scenario';
import { PlaceCustomerOrderScenario } from '../../../support/scenarios/place-customer-order-scenario';
import { container } from '../../../support/utils/inversify/inversify.config';

describe('create order by customer', (): void => {
  let fixtures: CreateOrderByCustomerFixtures;

  let loginCustomerScenario: LoginCustomerScenario;
  let registerCustomerScenario: RegisterCustomerScenario;
  let placeCustomerOrderScenario: PlaceCustomerOrderScenario;

  before((): void => {
    fixtures = Cypress.env('fixtures');

    loginCustomerScenario = container.get(LoginCustomerScenario);
    registerCustomerScenario = container.get(RegisterCustomerScenario);
    placeCustomerOrderScenario = container.get(PlaceCustomerOrderScenario);
  });

  beforeEach((): void => {
    cy.resetYvesCookies();
  });

  it('should be able to create an order by new registered customer', (): void => {
    const customer: Customer = registerCustomerScenario.execute();
    loginCustomerScenario.execute(customer);

    placeCustomerOrderScenario.execute(fixtures.concreteProductSkus);

    cy.contains('Your order has been placed successfully!');
  });

  it('should be able to create an order by existing customer [@order, @regression]', (): void => {
    loginCustomerScenario.execute(fixtures.customer);

    placeCustomerOrderScenario.execute(fixtures.concreteProductSkus);

    cy.contains('Your order has been placed successfully!');
  });
});
