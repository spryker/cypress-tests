import { container } from '@utils';
import { CartItemQuantityStaticFixtures, CartItemQuantityDynamicFixtures } from '@interfaces/yves';
import { CartPage, MultiCartPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe('cart item quantity', { tags: ['@cart'] }, (): void => {
  const cartPage = container.get(CartPage);
  const multiCartPage = container.get(MultiCartPage);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let staticFixtures: CartItemQuantityStaticFixtures;
  let dynamicFixtures: CartItemQuantityDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('customer should be able to increase a cart item quantity', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    multiCartPage.visit();
    multiCartPage.selectCart({ name: dynamicFixtures.quote1.name });
    cartPage.visitCartWithItems();
    cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 3 });

    cartPage.getCartSummary().contains('€900.00');
    cartPage.getCartCounter().contains('3');
    cartPage.getCartItemChangeQuantityField(dynamicFixtures.product.sku).should('have.value', '3');
  });

  it('guest customer should be able to increase a cart item quantity', (): void => {
    cartPage.visitCartWithItems();
    cartPage.quickAddToCart({ sku: dynamicFixtures.product.sku, quantity: 2 });
    cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 3 });

    cartPage.getCartSummary().contains('€900.00');
    cartPage.getCartCounter().contains('3');
    cartPage.getCartItemChangeQuantityField(dynamicFixtures.product.sku).should('have.value', '3');
  });

  it('customer should be able to decrease a cart item quantity', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    multiCartPage.visit();
    multiCartPage.selectCart({ name: dynamicFixtures.quote2.name });
    cartPage.visitCartWithItems();
    cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 1 });

    cartPage.getCartSummary().contains('€300.00');
    cartPage.getCartCounter().contains('1');
    cartPage.getCartItemChangeQuantityField(dynamicFixtures.product.sku).should('have.value', '1');
  });

  it('guest customer should be able to decrease a cart item quantity', (): void => {
    cartPage.visitCartWithItems();
    cartPage.quickAddToCart({ sku: dynamicFixtures.product.sku, quantity: 2 });
    cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 1 });

    cartPage.getCartSummary().contains('€300.00');
    cartPage.getCartCounter().contains('1');
    cartPage.getCartItemChangeQuantityField(dynamicFixtures.product.sku).should('have.value', '1');
  });

  it('changing cart item quantity should not scroll the page to the top', (): void => {
    cy.viewport(800, 800);

    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    multiCartPage.visit();
    multiCartPage.selectCart({ name: dynamicFixtures.quote1.name });
    cartPage.visitCartWithItems();
    cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 3 });

    cy.window().then((win) => {
      expect(win.scrollY).not.equal(0);
    });
  });

  it('customer should not be able to click checkout button until cart item quantity updating is not finished', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    multiCartPage.visit();
    multiCartPage.selectCart({ name: dynamicFixtures.quote2.name });
    cartPage.visitCartWithItems();
    cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 3 }, false);

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

  it('changing cart item quantity should reload the whole cart block', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    multiCartPage.visit();
    multiCartPage.selectCart({ name: dynamicFixtures.quote2.name });
    cartPage.visitCartWithItems();

    cartPage
      .getCheckoutButton()
      .invoke('append', '<div class="added-html">Added HTML</div>')
      .then(() => {
        cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 4 });
        cartPage.getCheckoutButton().then(($button) => {
          expect($button.find('.added-html')).to.not.exist;
        });
      });
  });
});
