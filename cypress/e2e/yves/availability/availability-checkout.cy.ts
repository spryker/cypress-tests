import { container } from '@utils';
import { AvailabilityCheckoutDynamicFixtures, AvailabilityCheckoutStaticFixtures } from '@interfaces/yves';
import { CartPage, CatalogPage, CustomerOverviewPage, ProductPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

describe(
  'availability checkout',
  {
    tags: ['@yves', '@availability', 'availability', 'cart', 'checkout', 'product', 'spryker-core'],
  },
  (): void => {
    const cartPage = container.get(CartPage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);

    let staticFixtures: AvailabilityCheckoutStaticFixtures;
    let dynamicFixtures: AvailabilityCheckoutDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('customer should not be able to add a larger quantity than the available stock', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer1.email,
        password: staticFixtures.defaultPassword,
      });

      addProductToCart();

      cartPage.visit();
      cartPage.changeQuantity({
        sku: dynamicFixtures.product.sku,
        quantity: staticFixtures.availableStock + 1,
      });

      // The availability pre-check rejects the update and caps the line back to the available stock.
      cy.contains(`only has availability of ${staticFixtures.availableStock}`).should('exist');
      cartPage
        .getCartItemChangeQuantityField(dynamicFixtures.product.sku)
        .should('have.value', String(staticFixtures.availableStock));
    });

    it('customer should be able to check out a product limited to its available stock', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer2.email,
        password: staticFixtures.defaultPassword,
      });

      addProductToCart();

      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        shouldTriggerOmsInCli: true,
        paymentMethod: getPaymentMethodBasedOnEnv(),
        isMultiShipment: Cypress.env('ENV_IS_SSP_ENABLED') ? true : false,
      });

      cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage(), { timeout: 15000 });
    });

    function addProductToCart(): void {
      if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
        catalogPage.visit();
        catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });

        // A freshly created product's availability/concrete data can still be propagating to
        // storage right after fixture setup; until it lands the PDP hides the add-to-cart button.
        // Reload the product page until the button is published before interacting with it.
        cy.url().then((productUrl) => {
          cy.reloadUntilFound(productUrl, '[data-qa="add-to-cart-button"]', 'body', 20, 3000);
        });

        productPage.addToCart({ quantity: 1 });

        return;
      }

      cartPage.visit();
      cartPage.quickAddToCart({ sku: dynamicFixtures.product.sku, quantity: 1 });
    }

    function getPaymentMethodBasedOnEnv(): string {
      return ['b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))
        ? 'dummyMarketplacePaymentInvoice'
        : 'dummyPaymentInvoice';
    }
  }
);
