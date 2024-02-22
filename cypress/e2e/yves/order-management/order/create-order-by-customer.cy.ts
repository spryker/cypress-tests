import { container } from '../../../../support/utils/inversify/inversify.config';
import {CreateOrderByCustomerDynamicFixtures, CreateOrderByCustomerStaticFixtures} from "../../../../support/types/yves/order-managment/order";
import {CustomerLoginScenario} from "../../../../support/scenarios/yves";
import {
  CartPage, CheckoutAddressPage, CheckoutPaymentPage, CheckoutShipmentPage, CheckoutSummaryPage,
} from "../../../../support/pages/yves";

describe('create order by customer', (): void => {
  let staticFixtures: CreateOrderByCustomerStaticFixtures;
  let dynamicFixtures: CreateOrderByCustomerDynamicFixtures;
  let loginCustomerScenario: CustomerLoginScenario;
  let cartPage: CartPage;
  let checkoutAddressPage: CheckoutAddressPage;
  let checkoutShipmentPage: CheckoutShipmentPage;
  let checkoutPaymentPage: CheckoutPaymentPage;
  let checkoutSummaryPage: CheckoutSummaryPage;

  before((): void => {
    cy.resetYvesCookies();
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
    loginCustomerScenario = container.get(CustomerLoginScenario);
    cartPage = container.get(CartPage);
    checkoutAddressPage = container.get(CheckoutAddressPage);
    checkoutShipmentPage = container.get(CheckoutShipmentPage);
    checkoutPaymentPage = container.get(CheckoutPaymentPage);
    checkoutSummaryPage = container.get(CheckoutSummaryPage);
  });

  beforeEach((): void => {
    loginCustomerScenario.execute(dynamicFixtures.customer.email, staticFixtures.customer.password);
    cartPage.visit();
  });

  it('should be able to create an order by existing customer [@order, @regression]', (): void => {
    cartPage.quickAddToCart(dynamicFixtures.product.sku, 1);
    cartPage.startCheckout();
    checkoutAddressPage.fillShippingAddress();
    checkoutShipmentPage.setStandardShippingMethod();
    checkoutPaymentPage.setDummyPaymentMethod();
    checkoutSummaryPage.placeOrder();

    cy.contains('Your order has been placed successfully!');
  });
});
