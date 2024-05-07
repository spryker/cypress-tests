import { container } from '@utils';
import { CartItemNoteManagementDynamicFixtures, CartItemNoteManagementStaticFixtures } from '@interfaces/yves';
import { CartPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

/**
 * Yves Cart Update Without Reload checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/4147904521/Yves+Cart+Update+Without+Reload+Checklist}
 */
describe.skip('cart item note management [skip]', { tags: ['@cart'] }, (): void => {
  const cartPage = container.get(CartPage);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let staticFixtures: CartItemNoteManagementStaticFixtures;
  let dynamicFixtures: CartItemNoteManagementDynamicFixtures;

  before((): void => {
    cy.pause();
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  it('guest customer should be able to add a cart item note', (): void => {
    cartPage.visit();
    cartPage.quickAddToCart({ sku: dynamicFixtures.product.sku, quantity: 2 });
    cartPage.addFirstCartItemNote({ message: staticFixtures.cartItemNote });
    cartPage.submitFirstCartItemNote();

    cartPage.getFirstCartItemNoteField().should('have.value', staticFixtures.cartItemNote);
  });

  it('guest customer should be able to remove a cart item note', (): void => {
    cartPage.visit();
    cartPage.quickAddToCart({ sku: dynamicFixtures.product.sku, quantity: 2 });
    cartPage.addFirstCartItemNote({ message: staticFixtures.cartItemNote });
    cartPage.submitFirstCartItemNote();
    cartPage.clearFirstCartItemNote();

    cartPage.getFirstCartItemNoteField().should('have.value', '');
  });

  it('customer should be able to add a cart item note', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    cartPage.visit();
    cartPage.addFirstCartItemNote({ message: staticFixtures.cartItemNote });
    cartPage.submitFirstCartItemNote();

    cartPage.getFirstCartItemNoteField().should('have.value', staticFixtures.cartItemNote);
  });

  it('customer should be able to remove a cart item note', (): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
    cartPage.visit();
    cartPage.addFirstCartItemNote({ message: staticFixtures.cartItemNote });
    cartPage.submitFirstCartItemNote();
    cartPage.clearFirstCartItemNote();

    cartPage.getFirstCartItemNoteField().should('have.value', '');
  });
});
