import { container } from '@utils';
import { CartItemNoteStaticFixtures, CartItemNoteDynamicFixtures } from '@interfaces/yves';
import { CartPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe('cart item note', { tags: ['@cart'] }, (): void => {
  const cartPage = container.get(CartPage);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let staticFixtures: CartItemNoteStaticFixtures;
  let dynamicFixtures: CartItemNoteDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('customer should be able to add a cart item note', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    visitCartWithProducts();

    cartPage.addLastCartItemNote({ message: staticFixtures.addCartItemNote });
    cartPage.submitLastCartItemNote();
    cartPage.getLastCartItemNoteField().contains(staticFixtures.addCartItemNote).should('exist');
  });

  it('guest customer should be able to add a cart item note', (): void => {
    visitCartWithProducts();

    cartPage.addLastCartItemNote({ message: staticFixtures.addCartItemNote });
    cartPage.submitLastCartItemNote();
    cartPage.getLastCartItemNoteField().contains(staticFixtures.addCartItemNote).should('exist');
  });

  it('customer should be able to remove a cart item note', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    visitCartWithProducts();

    cartPage.addLastCartItemNote({ message: staticFixtures.addCartItemNote });
    cartPage.submitLastCartItemNote();
    cartPage.clearLastCartItemNote();
    cartPage.getLastCartItemNoteField().should('have.value', '');
  });

  it('adding cart item note should not scroll the page to the top', (): void => {
    cy.viewport(800, 800);

    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    visitCartWithProducts();

    cartPage.addLastCartItemNote({ message: staticFixtures.addCartItemNote });
    cartPage.submitLastCartItemNote();

    cy.window().then((win) => {
      expect(win.scrollY).not.equal(0);
    });
  });

  it('customer should not be able to click checkout button until cart item note adding is not finished', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    visitCartWithProducts();

    cartPage.addLastCartItemNote({ message: staticFixtures.addCartItemNote });
    cartPage.submitLastCartItemNote();

    expect(cartPage.getCheckoutButton());
  });

  function visitCartWithProducts(): void {
    cartPage.visit();
    cartPage.quickAddToCart({ sku: dynamicFixtures.product1.sku, quantity: 1 });
    cartPage.quickAddToCart({ sku: dynamicFixtures.product2.sku, quantity: 1 });
  }
});
