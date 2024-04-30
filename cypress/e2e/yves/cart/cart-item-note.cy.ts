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

    cartPage.addLastCartItemNote({ message: staticFixtures.cartItemNote });
    cartPage.submitLastCartItemNote();
    cartPage.getLastCartItemNoteField().contains(staticFixtures.cartItemNote).should('exist');
  });

  it('guest customer should be able to add a cart item note', (): void => {
    visitCartWithProducts();

    cartPage.addLastCartItemNote({ message: staticFixtures.cartItemNote });
    cartPage.submitLastCartItemNote();
    cartPage.getLastCartItemNoteField().contains(staticFixtures.cartItemNote).should('exist');
  });

  it('customer should be able to remove a cart item note', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    visitCartWithProducts();

    cartPage.addLastCartItemNote({ message: staticFixtures.cartItemNote });
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

    cartPage.addLastCartItemNote({ message: staticFixtures.cartItemNote });
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

    cartPage.addLastCartItemNote({ message: staticFixtures.cartItemNote });
    cartPage.submitLastCartItemNote(false);

    Cypress.on('fail', (error) => {
      if (!error.message.includes('is being covered by another element')) {
        throw error;
      }
      cy.log('Button click failed as expected. The button is not clickable.');
    });

    cartPage
      .getCheckoutButton()
      .click({ timeout: 100 })
      .then(() => {
        throw new Error('Button clicked successfully.');
      });
  });

  it('adding cart item note should reload the whole cart block', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    visitCartWithProducts();

    cartPage
      .getCheckoutButton()
      .invoke('append', '<div class="added-html">Added HTML</div>')
      .then(() => {
        cartPage.addLastCartItemNote({ message: staticFixtures.cartItemNote });
        cartPage.submitLastCartItemNote();
        cartPage.getCheckoutButton().then(($button) => {
          expect($button.find('.added-html')).to.not.exist;
        });
      });
  });

  function visitCartWithProducts(): void {
    cartPage.visitCartWithItems();
    cartPage.quickAddToCart({ sku: dynamicFixtures.product1.sku, quantity: 1 });
    cartPage.quickAddToCart({ sku: dynamicFixtures.product2.sku, quantity: 1 });
  }
});
