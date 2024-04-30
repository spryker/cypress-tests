import { container } from '@utils';
import { CartItemRemoveStaticFixtures, CartItemRemoveDynamicFixtures } from '@interfaces/yves';
import { CartPage, MultiCartPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe('cart item remove', { tags: ['@cart'] }, (): void => {
  const cartPage = container.get(CartPage);
  const multiCartPage = container.get(MultiCartPage);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let staticFixtures: CartItemRemoveStaticFixtures;
  let dynamicFixtures: CartItemRemoveDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('customer should be able to remove a cart item', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    multiCartPage.visit();
    multiCartPage.selectCart({ name: dynamicFixtures.quote1.name });
    cartPage.visitCartWithItems();
    cartPage.removeProduct({ sku: dynamicFixtures.product1.sku });

    cartPage.getCartSummary().contains('€600.00');
    cartPage.getCartCounter().contains('2');
  });

  it('guest customer should be able to remove a cart item', (): void => {
    cartPage.visitCartWithItems();
    cartPage.quickAddToCart({ sku: dynamicFixtures.product1.sku, quantity: 1 });
    cartPage.quickAddToCart({ sku: dynamicFixtures.product2.sku, quantity: 2 });
    cartPage.removeProduct({ sku: dynamicFixtures.product2.sku });

    cartPage.getCartSummary().contains('€300.00');
    cartPage.getCartCounter().contains('1');
  });

  it('customer should not be able to click checkout button until cart item removal is not finished', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    multiCartPage.visit();
    multiCartPage.selectCart({ name: dynamicFixtures.quote2.name });
    cartPage.visitCartWithItems();
    cartPage.removeProduct({ sku: dynamicFixtures.product1.sku }, false);

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

  it('removing cart item should not scroll the page to the top', (): void => {
    cy.viewport(800, 800);

    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    multiCartPage.visit();
    multiCartPage.selectCart({ name: dynamicFixtures.quote2.name });
    cartPage.visitCartWithItems();
    cartPage.removeProduct({ sku: dynamicFixtures.product2.sku });

    cy.window().then((win) => {
      expect(win.scrollY).not.equal(0);
    });
  });

  it('removing cart item should reload the whole cart block', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    multiCartPage.visit();
    multiCartPage.selectCart({ name: dynamicFixtures.quote1.name });
    cartPage.visitCartWithItems();

    cartPage
      .getCheckoutButton()
      .invoke('append', '<div class="added-html">Added HTML</div>')
      .then(() => {
        cartPage.removeProduct({ sku: dynamicFixtures.product2.sku });
        cartPage.getCheckoutButton().then(($button) => {
          expect($button.find('.added-html')).to.not.exist;
        });
      });
  });
});
