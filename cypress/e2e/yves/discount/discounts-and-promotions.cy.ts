import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { DiscountsAndPromotionsDynamicFixtures, DiscountsAndPromotionsStaticFixtures } from '@interfaces/yves';
import { CartPage, CustomerOverviewPage } from '@pages/yves';
import { DiscountPage } from '@pages/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'discounts and promotions',
  {
    tags: ['@yves', '@discount', 'discount', 'promotions-discounts', 'cart', 'checkout', 'spryker-discount'],
  },
  (): void => {
    const cartPage = container.get(CartPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const discountPage = container.get(DiscountPage);
    const checkoutScenario = container.get(CheckoutScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: DiscountsAndPromotionsStaticFixtures;
    let dynamicFixtures: DiscountsAndPromotionsDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    // The three discounts collect on any sku, so left active they would discount every cart in the
    // environment and the promotion would offer its product in every one of them. The source test
    // opened with "deactivate all discounts in the database" for the same reason; this closes with
    // the narrower version of it, taking back only what this spec seeded.
    after((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      [
        dynamicFixtures.cartRuleDiscount.display_name,
        dynamicFixtures.voucherDiscount.display_name,
        dynamicFixtures.promotionDiscount.display_name,
      ].forEach((name: string): void => discountPage.deactivateDiscount(name));
    });

    it('given a cart rule, a voucher and a promotional product discount when the voucher is redeemed and the promotional product is added then all three are applied and the order is placed', (): void => {
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
