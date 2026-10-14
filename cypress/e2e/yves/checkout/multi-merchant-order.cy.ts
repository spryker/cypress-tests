import { container, getPaymentMethodBasedOnEnv, skipWhenFeatureAbsent } from '@utils';
import { MultiMerchantOrderDynamicFixtures, MultiMerchantOrderStaticFixtures } from '@interfaces/yves';
import { CartPage, CheckoutSummaryPage, CustomerOverviewPage } from '@pages/yves';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'multi merchant order',
  {
    tags: [
      '@yves',
      '@checkout',
      'checkout',
      'cart',
      'marketplace-product-offer',
      'product-offer-shipment',
      'marketplace-order-management',
      'spryker-core',
    ],
  },
  (): void => {
    // Product offers belong to the marketplace storefronts; the plain B2C shop has none.
    if (['b2c'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the B2C storefront has no product offers', () => {});

      return;
    }

    skipWhenFeatureAbsent('marketplaceStorefront', ['b2b']);

    const cartPage = container.get(CartPage);
    const checkoutSummaryPage = container.get(CheckoutSummaryPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const checkoutScenario = container.get(CheckoutScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: MultiMerchantOrderStaticFixtures;
    let dynamicFixtures: MultiMerchantOrderDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a cart holding the main merchant product and an offer from each of two merchants when the order is placed then it is split into one shipment per merchant', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      // The cart names the merchant behind every offer, which is what the split is derived from.
      cartPage.visit();
      cartPage.assertBodyContainsText(`${staticFixtures.soldByText} ${dynamicFixtures.merchant1.name}`);
      cartPage.assertBodyContainsText(`${staticFixtures.soldByText} ${dynamicFixtures.merchant2.name}`);

      // Act
      // No multi-shipment selection: the split here comes from the items' merchants, not from
      // per-item delivery addresses, and setStandardShippingMethod covers every group it produces.
      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        shouldTriggerOmsInCli: true,
        paymentMethod: getPaymentMethodBasedOnEnv(),
      });

      // Assert
      customerOverviewPage.assertBodyContainsText(customerOverviewPage.getPlacedOrderSuccessMessage(), {
        timeout: 15000,
      });

      checkoutSummaryPage.getPlacedOrderReference().then((orderReference: string) => {
        userLoginScenario.execute({
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });
        salesIndexPage.visit();
        salesIndexPage.viewByReference(orderReference);

        salesDetailPage.getOrderItemTables().should('have.length', staticFixtures.expectedShipmentCount);
      });
    });
  }
);
