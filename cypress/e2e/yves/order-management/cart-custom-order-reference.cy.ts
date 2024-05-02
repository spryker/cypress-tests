import { container } from '@utils';
import { CartCustomOrderReferenceStaticFixtures, CartCustomOrderReferenceDynamicFixtures } from '@interfaces/yves';
import { MultiCartPage, CustomOrderReferenceCartPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe('cart item quantity', { tags: ['@order-management'] }, (): void => {
  const multiCartPage = container.get(MultiCartPage);
  const customOrderReferenceCartPage = container.get(CustomOrderReferenceCartPage);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let staticFixtures: CartCustomOrderReferenceStaticFixtures;
  let dynamicFixtures: CartCustomOrderReferenceDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
  });

  it('customer should be able to add a custom order reference', (): void => {
    multiCartPage.visit();
    multiCartPage.selectCart({ name: dynamicFixtures.quote.name });

    customOrderReferenceCartPage.addCustomOrderReferenceInput(staticFixtures.reference);

    customOrderReferenceCartPage.getCustomOrderReferenceInput().should('have.value', staticFixtures.reference);
  });
});
