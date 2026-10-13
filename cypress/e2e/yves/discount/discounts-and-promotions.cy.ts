import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { DiscountsAndPromotionsDynamicFixtures, DiscountsAndPromotionsStaticFixtures } from '@interfaces/yves';
import { CartPage, CustomerOverviewPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

describe(
  'discounts and promotions',
  {
    tags: ['@yves', '@discount', 'discount', 'promotions-discounts', 'cart', 'checkout', 'spryker-discount'],
  },
  (): void => {
    const cartPage = container.get(CartPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const checkoutScenario = container.get(CheckoutScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: DiscountsAndPromotionsStaticFixtures;
    let dynamicFixtures: DiscountsAndPromotionsDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a cart rule, a voucher and a promotional product discount when both codes are redeemed and the promotional product is added then all three are applied and the order is placed', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      // Act
      cartPage.visit();

      // Assert
      // A cart rule needs no redeeming: it collects on its own as soon as the cart qualifies.
      cartPage.getCartDiscountSummary().should('contain', dynamicFixtures.cartRuleDiscount.display_name);

      // Act
      cartPage.applyVoucherCode(dynamicFixtures.voucherCode.code);

      // Assert
      cartPage.getCartDiscountSummary().should('contain', dynamicFixtures.voucherDiscount.display_name);

      // Act
      // The promotion is redeemed by a code of its own, so it is offered to this cart only and never
      // to a cart of another run carrying the same fixture product brand.
      cartPage.applyVoucherCode(dynamicFixtures.promotionVoucherCode.code);
      cartPage.addPromotionalProduct(dynamicFixtures.promotionalProduct.sku);

      // Assert
      cartPage.getCartDiscountSummary().should('contain', dynamicFixtures.promotionDiscount.display_name);
      cartPage.getProductCartItems().should('contain', dynamicFixtures.promotionalProduct.sku);

      // Act
      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        paymentMethod: getPaymentMethodBasedOnEnv(),
        shouldTriggerOmsInCli: true,
      });

      // Assert
      customerOverviewPage.assertBodyContainsText(customerOverviewPage.getPlacedOrderSuccessMessage(), {
        timeout: 15000,
      });
    });
  }
);
