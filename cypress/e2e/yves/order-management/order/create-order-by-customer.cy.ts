import { container } from '../../../../support/utils/inversify/inversify.config';
import {CreateOrderByCustomerDynamicFixtures, CreateOrderByCustomerStaticFixtures} from "../../../../support/types/yves/order-managment/order";
import {CustomerLoginScenario} from "../../../../support/scenarios/yves";
import {
  CartPage, CheckoutAddressPage, CheckoutPaymentPage, CheckoutShipmentPage, CheckoutSummaryPage,
} from "../../../../support/pages/yves";

describe('create order by customer',{tags: ['@order-management']}, (): void => {
  const cartPage: CartPage = container.get(CartPage);
  const loginCustomerScenario: CustomerLoginScenario = container.get(CustomerLoginScenario);
  const checkoutAddressPage: CheckoutAddressPage = container.get(CheckoutAddressPage);
  const checkoutShipmentPage: CheckoutShipmentPage = container.get(CheckoutShipmentPage);
  const checkoutPaymentPage: CheckoutPaymentPage = container.get(CheckoutPaymentPage);
  const checkoutSummaryPage: CheckoutSummaryPage = container.get(CheckoutSummaryPage);

  let staticFixtures: CreateOrderByCustomerStaticFixtures;
  let dynamicFixtures: CreateOrderByCustomerDynamicFixtures;

  before((): void => {
    cy.resetYvesCookies();
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    loginCustomerScenario.execute(dynamicFixtures.customer.email, staticFixtures.customer.password);
    cartPage.visit();
  });

  it('should be able to create an order by existing customer', (): void => {
    cartPage.quickAddToCart(dynamicFixtures.product.sku, 1);
    cartPage.startCheckout();
    checkoutAddressPage.fillShippingAddress();
    checkoutShipmentPage.setStandardShippingMethod();
    checkoutPaymentPage.setDummyPaymentMethod();
    checkoutSummaryPage.placeOrder();

    cy.contains('Your order has been placed successfully!');
  });
});
