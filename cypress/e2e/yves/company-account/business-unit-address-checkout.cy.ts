import { container, getPaymentMethodBasedOnEnv } from '@utils';
import {
  BusinessUnitAddressCheckoutDynamicFixtures,
  BusinessUnitAddressCheckoutStaticFixtures,
} from '@interfaces/yves';
import {
  CartPage,
  CheckoutAddressPage,
  CompanyUserSelectPage,
  CustomerOverviewPage,
  OrderDetailsPage,
} from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario, ProductAddToCartScenario } from '@scenarios/yves';

describe(
  'business unit address on checkout',
  { tags: ['@yves', '@checkout', 'checkout', 'company-account', 'cart', 'spryker-core'] },
  (): void => {
    // Only the company-account storefronts put a business unit address in the checkout select.
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the B2C storefronts have no company accounts', () => {});

      return;
    }

    const cartPage = container.get(CartPage);
    const checkoutAddressPage = container.get(CheckoutAddressPage);
    const companyUserSelectPage = container.get(CompanyUserSelectPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const orderDetailsPage = container.get(OrderDetailsPage);
    const checkoutScenario = container.get(CheckoutScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const productAddToCartScenario = container.get(ProductAddToCartScenario);

    let staticFixtures: BusinessUnitAddressCheckoutStaticFixtures;
    let dynamicFixtures: BusinessUnitAddressCheckoutDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a company user with no personal address when the business unit address is chosen at checkout then the order ships to it', (): void => {
      // Arrange
      // The customer fixture deliberately has no address of its own, so the only address the
      // checkout select can offer is the one belonging to the business unit.
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      // Without an active company user the storefront shows "No selected company" and the checkout
      // address select offers nothing but "Define new address" - no business unit address at all.
      companyUserSelectPage.visit();
      companyUserSelectPage.selectBusinessUnit({ idCompanyUser: dynamicFixtures.companyUser.id_company_user });

      productAddToCartScenario.execute({ sku: dynamicFixtures.product1.sku });

      cartPage.visit();
      cartPage.startCheckout();

      // Act
      checkoutAddressPage.setBillingSameAsShipping(true);
      checkoutAddressPage.selectShippingAddressByText(staticFixtures.businessUnitAddressStreet);
      checkoutAddressPage.submitAddressStep();

      checkoutScenario.execute({
        shouldSkipAddressStep: true,
        paymentMethod: getPaymentMethodBasedOnEnv(),
      });

      // Assert
      customerOverviewPage.assertBodyContainsText(customerOverviewPage.getPlacedOrderSuccessMessage(), {
        timeout: 15000,
      });

      customerOverviewPage.viewLastPlacedOrder();
      orderDetailsPage.assertBodyContainsText(staticFixtures.businessUnitAddressStreet);
    });
  }
);
