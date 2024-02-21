import { container } from '../../../../support/utils/inversify/inversify.config';
import {CreateOrderByCustomerDynamicFixtures, CreateOrderByCustomerStaticFixtures} from "../../../../support/types/yves/order-managment/order";
import {YvesLoginCustomerScenario} from "../../../../support/scenarios/yves";
import {
  YvesCartPage, YvesCheckoutAddressPage, YvesCheckoutPaymentPage, YvesCheckoutShipmentPage, YvesCheckoutSummaryPage,
} from "../../../../support/pages/yves";

describe('create order by customer', (): void => {
  let staticFixtures: CreateOrderByCustomerStaticFixtures;
  let dynamicFixtures: CreateOrderByCustomerDynamicFixtures;
  let loginCustomerScenario: YvesLoginCustomerScenario;
  let cartPage: YvesCartPage;
  let checkoutAddressPage: YvesCheckoutAddressPage;
  let checkoutShipmentPage: YvesCheckoutShipmentPage;
  let checkoutPaymentPage: YvesCheckoutPaymentPage;
  let checkoutSummaryPage: YvesCheckoutSummaryPage;

  before((): void => {
    cy.resetYvesCookies();
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
    loginCustomerScenario = container.get(YvesLoginCustomerScenario);
    cartPage = container.get(YvesCartPage);
    checkoutAddressPage = container.get(YvesCheckoutAddressPage);
    checkoutShipmentPage = container.get(YvesCheckoutShipmentPage);
    checkoutPaymentPage = container.get(YvesCheckoutPaymentPage);
    checkoutSummaryPage = container.get(YvesCheckoutSummaryPage);
  });

  beforeEach((): void => {
    loginCustomerScenario.execute(dynamicFixtures.customer.email, staticFixtures.customer.password);
  });

  it('should be able to create an order by existing customer [@order, @regression]', (): void => {
    cartPage.visit();
    cartPage.quickAddToCart(dynamicFixtures.product.sku, 1);
    cartPage.startCheckout();
    checkoutAddressPage.fillShippingAddress();
    checkoutShipmentPage.setStandardShippingMethod();
    checkoutPaymentPage.setDummyPaymentMethod();
    checkoutSummaryPage.placeOrder();

    cy.contains('Your order has been placed successfully!');
  });
});
