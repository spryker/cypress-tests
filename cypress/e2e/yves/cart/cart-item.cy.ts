import { container } from '@utils';
import { CartItemStaticFixtures, CartItemDynamicFixtures } from '@interfaces/yves';
import { CartPage, MultiCartPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe('cart item quantity', { tags: ['@cart'] }, (): void => {
  const cartPage = container.get(CartPage);
  const multiCartPage = container.get(MultiCartPage);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let staticFixtures: CartItemStaticFixtures;
  let dynamicFixtures: CartItemDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('customer should be able to increase a cart item quantity', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    multiCartPage.visit();
    multiCartPage.selectCart({ name: dynamicFixtures.quote.name });
    cartPage.changeQuantity({ sku: dynamicFixtures.product1.sku, quantity: 3 });

    cartPage.getCartSummary().contains('€1,200.00');
    cartPage.getCartCounter().contains('4');
    cartPage.getCartItemChangeQuantityField(dynamicFixtures.product1.sku).should('have.value', '3');
  });

  it('guest customer should be able to increase a cart item quantity', (): void => {
    cartPage.visitCartWithItems();
    cartPage.quickAddToCart({ sku: dynamicFixtures.product1.sku, quantity: 2 });
    cartPage.changeQuantity({ sku: dynamicFixtures.product1.sku, quantity: 3 });

    cartPage.getCartSummary().contains('€900.00');
    cartPage.getCartCounter().contains('3');
    cartPage.getCartItemChangeQuantityField(dynamicFixtures.product1.sku).should('have.value', '3');
  });

  it('customer should be able to decrease a cart item quantity', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    cartPage.visitCartWithItems();
    cartPage.changeQuantity({ sku: dynamicFixtures.product1.sku, quantity: 1 });

    cartPage.getCartSummary().contains('€600.00');
    cartPage.getCartCounter().contains('2');
    cartPage.getCartItemChangeQuantityField(dynamicFixtures.product1.sku).should('have.value', '1');
  });

  it('guest customer should be able to decrease a cart item quantity', (): void => {
    cartPage.visitCartWithItems();
    cartPage.quickAddToCart({ sku: dynamicFixtures.product1.sku, quantity: 2 });
    cartPage.changeQuantity({ sku: dynamicFixtures.product1.sku, quantity: 1 });

    cartPage.getCartSummary().contains('€300.00');
    cartPage.getCartCounter().contains('1');
    cartPage.getCartItemChangeQuantityField(dynamicFixtures.product1.sku).should('have.value', '1');
  });

  it('customer should be able to remove a cart item', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    cartPage.visitCartWithItems();
    cartPage.removeProduct({ sku: dynamicFixtures.product1.sku });

    cartPage.getCartSummary().contains('€300.00');
    cartPage.getCartCounter().contains('1');
  });

  it('guest customer should be able to remove a cart item', (): void => {
    cartPage.visitCartWithItems();
    cartPage.quickAddToCart({ sku: dynamicFixtures.product1.sku, quantity: 1 });
    cartPage.quickAddToCart({ sku: dynamicFixtures.product2.sku, quantity: 2 });
    cartPage.removeProduct({ sku: dynamicFixtures.product2.sku });

    cartPage.getCartSummary().contains('€300.00');
    cartPage.getCartCounter().contains('1');
  });

  it('customer should be able to add a cart item note', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    cartPage.visitCartWithItems();
    cartPage.addFirstCartItemNote({ message: staticFixtures.cartItemNote });
    cartPage.submitFirstCartItemNote();

    cartPage.getFirstCartItemNoteField().contains(staticFixtures.cartItemNote).should('exist');
  });

  it('guest customer should be able to add a cart item note', (): void => {
    cartPage.visitCartWithItems();
    cartPage.quickAddToCart({ sku: dynamicFixtures.product1.sku, quantity: 2 });
    cartPage.addFirstCartItemNote({ message: staticFixtures.cartItemNote });
    cartPage.submitFirstCartItemNote();

    cartPage.getFirstCartItemNoteField().contains(staticFixtures.cartItemNote).should('exist');
  });

  it('customer should be able to remove a cart item note', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    cartPage.visitCartWithItems();
    cartPage.addFirstCartItemNote({ message: staticFixtures.cartItemNote });
    cartPage.submitFirstCartItemNote();
    cartPage.clearFirstCartItemNote();

    cartPage.getFirstCartItemNoteField().should('have.value', '');
  });
});
