import { Page as CartPage } from '../pages/yves/cart/page';
import { Page as CheckoutCustomerPage } from '../pages/yves/checkout/customer/page';
import { Page as CheckoutAddressPage } from '../pages/yves/checkout/address/page';
import { Page as CheckoutShipmentPage } from '../pages/yves/checkout/shipment/page';
import { Page as CheckoutPaymentPage } from '../pages/yves/checkout/payment/page';
import { Page as CheckoutSummaryPage } from '../pages/yves/checkout/summary/page';

export class PlaceGuestOrderScenario {
  static execute = (productSkus: string[]): void => {
    const cartPage = new CartPage();

    cy.visit(cartPage.PAGE_URL);
    productSkus.forEach((productSku: string) => {
      cartPage.quickAddToCart(productSku, 1);
    });

    cartPage.startCheckout();

    new CheckoutCustomerPage().checkoutAsGuest();
    new CheckoutAddressPage().fillShippingAddress();
    new CheckoutShipmentPage().setStandardShippingMethod();
    new CheckoutPaymentPage().setDummyPaymentMethod();
    new CheckoutSummaryPage().placeOrder();
  };
}
