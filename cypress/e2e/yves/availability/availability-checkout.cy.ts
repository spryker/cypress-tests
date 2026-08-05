import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { AvailabilityCheckoutDynamicFixtures, AvailabilityCheckoutStaticFixtures } from '@interfaces/yves';
import { CartPage, CustomerOverviewPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario, ProductAddToCartScenario } from '@scenarios/yves';

describe(
  'availability checkout',
  {
    tags: ['@yves', '@availability', 'availability', 'cart', 'checkout', 'product', 'spryker-core'],
  },
  (): void => {
    const cartPage = container.get(CartPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);
    const productAddToCartScenario = container.get(ProductAddToCartScenario);

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

      productAddToCartScenario.execute({ sku: dynamicFixtures.product.sku });

      cartPage.visit();
      cartPage.changeQuantity({
        sku: dynamicFixtures.product.sku,
        quantity: staticFixtures.availableStock + 1,
      });

      // The availability pre-check rejects the update and caps the line back to the available stock.
      cartPage.assertBodyContainsText(`only has availability of ${staticFixtures.availableStock}`);
      cartPage
        .getCartItemChangeQuantityField(dynamicFixtures.product.sku)
        .should('have.value', String(staticFixtures.availableStock));
    });

    it('customer should be able to check out a product limited to its available stock', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer2.email,
        password: staticFixtures.defaultPassword,
      });

      productAddToCartScenario.execute({ sku: dynamicFixtures.product.sku });

      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        shouldTriggerOmsInCli: true,
        paymentMethod: getPaymentMethodBasedOnEnv(),
        isMultiShipment: Cypress.env('ENV_IS_SSP_ENABLED'),
      });

      customerOverviewPage.assertBodyContainsText(customerOverviewPage.getPlacedOrderSuccessMessage(), {
        timeout: 15000,
      });
    });
  }
);
