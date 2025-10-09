import { container } from '@utils';
import { CartItemNoteManagementDynamicFixtures, CartItemNoteManagementStaticFixtures } from '@interfaces/yves';
import { CartPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

/**
 * Yves Cart Update Without Reload checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/4147904521/Yves+Cart+Update+Without+Reload+Checklist}
 */
describe(
  'cart item note management',
  { tags: ['@yves', '@cart', 'cart', 'marketplace-cart', 'spryker-core', 'quick-add-to-cart'] },
  (): void => {
    const cartPage = container.get(CartPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: CartItemNoteManagementStaticFixtures;
    let dynamicFixtures: CartItemNoteManagementDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    onlySuiteIt('guest customer should be able to add a cart item note', (): void => {
      cartPage.visit();
      cartPage.quickAddToCart({ sku: dynamicFixtures.product.sku, quantity: 2 });
      cartPage.addFirstCartItemNote({ message: staticFixtures.cartItemNote });
      cartPage.submitFirstCartItemNote();

      cartPage.getFirstCartItemNoteField().should('have.value', staticFixtures.cartItemNote);
    });

    onlySuiteIt('guest customer should be able to remove a cart item note', (): void => {
      cartPage.visit();
      cartPage.quickAddToCart({ sku: dynamicFixtures.product.sku, quantity: 2 });
      cartPage.addFirstCartItemNote({ message: staticFixtures.cartItemNote });
      cartPage.submitFirstCartItemNote();

      cartPage.clearFirstCartItemNote();
      cartPage.submitFirstCartItemNote();

      cartPage.getFirstCartItemNoteField().should('have.value', '');
    });

    skipB2cIt('customer should be able to add a cart item note', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      cartPage.visit();
      cartPage.addFirstCartItemNote({ message: staticFixtures.cartItemNote });
      cartPage.submitFirstCartItemNote();

      cartPage.getFirstCartItemNoteField().should('have.value', staticFixtures.cartItemNote);
    });

    skipB2cIt('customer should be able to remove a cart item note', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      cartPage.visit();
      cartPage.addFirstCartItemNote({ message: staticFixtures.cartItemNote });
      cartPage.submitFirstCartItemNote();

      cartPage.clearFirstCartItemNote();
      cartPage.submitFirstCartItemNote();

      cartPage.getFirstCartItemNoteField().should('have.value', '');
    });

    function skipB2cIt(description: string, testFn: () => void): void {
      (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
    }

    function onlySuiteIt(description: string, testFn: () => void): void {
      (['suite'].includes(Cypress.env('repositoryId')) ? it : it.skip)(description, testFn);
    }
  }
);
