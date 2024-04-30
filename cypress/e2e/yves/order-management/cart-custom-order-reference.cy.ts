import { container } from '@utils';
import { CartCustomOrderReferenceStaticFixtures, CartCustomOrderReferenceDynamicFixtures } from '@interfaces/yves';
import { CartPage, MultiCartPage, CustomOrderReferenceCartPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe('cart item quantity', { tags: ['@order-management'] }, (): void => {
  const cartPage = container.get(CartPage);
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
    cartPage.visitCartWithItems();

    customOrderReferenceCartPage.addCustomOrderReferenceInput(staticFixtures.reference);

    customOrderReferenceCartPage.getCustomOrderReferenceInput().should('have.value', staticFixtures.reference);
  });

  it('adding a custom order reference to cart should not scroll the page to the top', (): void => {
    cy.viewport(800, 800);

    multiCartPage.visit();
    multiCartPage.selectCart({ name: dynamicFixtures.quote.name });
    cartPage.visitCartWithItems();

    customOrderReferenceCartPage.addCustomOrderReferenceInput(staticFixtures.reference);

    cy.window().then((win) => {
      expect(win.scrollY).not.equal(0);
    });
  });

  it('adding custom order reference should not reload the whole cart block', (): void => {
    multiCartPage.visit();
    multiCartPage.selectCart({ name: dynamicFixtures.quote.name });
    cartPage.visitCartWithItems();

    customOrderReferenceCartPage.addCustomOrderReferenceInput(staticFixtures.reference);

    cartPage
      .getCheckoutButton()
      .invoke('append', '<div class="added-html">Added HTML</div>')
      .then(() => {
        customOrderReferenceCartPage.addCustomOrderReferenceInput(staticFixtures.reference);

        cartPage.getCheckoutButton().then(($button) => {
          expect($button.find('.added-html')).to.exist;
        });
      });
  });
});
