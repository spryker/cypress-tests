import { container } from '../../../support/utils/inversify/inversify.config';
import { YvesLoginCustomerScenario } from '../../../support/scenarios/yves/yves-login-customer-scenario';
import { RegisterCustomerScenario } from '../../../support/scenarios/yves/register-customer-scenario';
import { PlaceCustomerOrderScenario } from '../../../support/scenarios/yves/place-customer-order-scenario';

describe('create order by customer', (): void => {
  const loginCustomerScenario: YvesLoginCustomerScenario = container.get(YvesLoginCustomerScenario);
  const registerCustomerScenario: RegisterCustomerScenario = container.get(RegisterCustomerScenario);
  const placeCustomerOrderScenario: PlaceCustomerOrderScenario = container.get(PlaceCustomerOrderScenario);

  let fixtures: CreateOrderByCustomerFixtures;

  before((): void => {
    fixtures = Cypress.env('fixtures');
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

  it('should be able to create an order by existing customer', (): void => {
    loginCustomerScenario.execute(fixtures.customer);

    placeCustomerOrderScenario.execute(fixtures.concreteProductSkus);

    cy.contains('Your order has been placed successfully!');
  });
});
