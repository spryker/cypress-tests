import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { MultiMerchantOrderDynamicFixtures, MultiMerchantOrderStaticFixtures } from '@interfaces/yves';
import { CartPage, CatalogPage, CheckoutSummaryPage, CustomerOverviewPage, ProductPage } from '@pages/yves';
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
    // Product offers belong to the marketplace storefronts; the plain B2B and B2C shops have none.
    if (['b2b', 'b2c'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the non-marketplace storefronts have no product offers', () => {});

      return;
    }

    const cartPage = container.get(CartPage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
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

      // Each product is added from its own detail page rather than quick-added by SKU: quick-add
      // puts the plain product in the cart, so every item would belong to the main merchant and
      // there would be nothing to split. Reaching the product through its page is what attaches
      // the merchant's offer to the item.
      addProductFromItsDetailPage(dynamicFixtures.product1.sku);
      addProductFromItsDetailPage(dynamicFixtures.product2.sku, dynamicFixtures.productOffer1.product_offer_reference);
      addProductFromItsDetailPage(dynamicFixtures.product3.sku, dynamicFixtures.productOffer2.product_offer_reference);

      // Assert
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

    function addProductFromItsDetailPage(sku: string, productOfferReference?: string): void {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: sku });

      if (productOfferReference) {
        productPage.selectSoldByProductOffer({ productOfferReference });
      }

      productPage.addToCart();
    }
  }
);
