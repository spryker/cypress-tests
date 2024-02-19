import { container } from '../../../../support/utils/inversify/inversify.config';
import {CreateOrderByCustomerDynamicFixtures, CreateOrderByCustomerStaticFixtures} from "../../../../support/types/yves/order-managment/order";
import {PlaceCustomerOrderScenario, YvesLoginCustomerScenario} from "../../../../support/scenarios/yves";

describe('create order by customer', (): void => {
  let staticFixtures: CreateOrderByCustomerStaticFixtures;
  let dynamicFixtures: CreateOrderByCustomerDynamicFixtures;
  let loginCustomerScenario: YvesLoginCustomerScenario;
  let placeCustomerOrderScenario: PlaceCustomerOrderScenario;

  before((): void => {
    cy.resetYvesCookies();
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
    loginCustomerScenario = container.get(YvesLoginCustomerScenario);
    placeCustomerOrderScenario = container.get(PlaceCustomerOrderScenario);
    loginCustomerScenario = container.get(YvesLoginCustomerScenario);
  });

  beforeEach((): void => {
    loginCustomerScenario.execute(dynamicFixtures.customer.email, staticFixtures.customer.password);
  });

  it('should be able to create an order by existing customer [@order, @regression]', (): void => {
    placeCustomerOrderScenario.execute([dynamicFixtures.product.sku]);

    cy.contains('Your order has been placed successfully!');
  });
});
