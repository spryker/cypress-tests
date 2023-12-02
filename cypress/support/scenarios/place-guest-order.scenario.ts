import { Page as CartPage } from '../pages/yves/cart/page';
import { Page as CustomerPage } from '../pages/yves/checkout/customer/page';
import { Page as AddressPage } from '../pages/yves/checkout/address/page';
import { Page as ShipmentPage } from '../pages/yves/checkout/shipment/page';
import { Page as PaymentPage } from '../pages/yves/checkout/payment/page';
import { Page as SummaryPage } from '../pages/yves/checkout/summary/page';

export class PlaceGuestOrderScenario {
  static execute = (productSkus: string[]): void => {
    const cartPage = new CartPage();
    const customerPage = new CustomerPage();
    const addressPage = new AddressPage();
    const shipmentPage = new ShipmentPage();
    const paymentPage = new PaymentPage();
    const summaryPage = new SummaryPage();

    cy.visit(cartPage.PAGE_URL);
    productSkus.forEach((productSku: string) => {
      cartPage.quickAddToCart(productSku, 1);
    });

    cartPage.startCheckout();
    customerPage.checkoutAsGuest();
    addressPage.fillShippingAddress();
    shipmentPage.setStandardShippingMethod();
    paymentPage.setDummyPaymentMethod();
    summaryPage.placeOrder();
  };
}
