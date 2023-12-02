import { Page as CartPage } from '../pages/yves/cart/page';
import { Page as AddressPage } from '../pages/yves/checkout/address/page';
import { Page as ShipmentPage } from '../pages/yves/checkout/shipment/page';
import { Page as PaymentPage } from '../pages/yves/checkout/payment/page';
import { Page as SummaryPage } from '../pages/yves/checkout/summary/page';

export class PlaceCustomerOrderScenario {
  static execute = (productSkus: string[]): void => {
    const cartPage = new CartPage();
    const addressPage = new AddressPage();
    const shipmentPage = new ShipmentPage();
    const paymentPage = new PaymentPage();
    const summaryPage = new SummaryPage();

    cy.visit(cartPage.PAGE_URL);
    productSkus.forEach((productSku: string) => {
      cartPage.quickAddToCart(productSku, 1);
    });

    cartPage.startCheckout();
    addressPage.fillShippingAddress();
    shipmentPage.setStandardShippingMethod();
    paymentPage.setDummyPaymentMethod();
    summaryPage.placeOrder();
  };
}
