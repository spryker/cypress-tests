import { CartPage } from "../../pages/yves/cart/cart.page";
import { AddressPage } from "../../pages/yves/checkout/address/address.page";
import { ShipmentPage } from "../../pages/yves/checkout/shipment/shipment.page";
import { PaymentPage } from "../../pages/yves/checkout/payment/payment.page";
import { SummaryPage } from "../../pages/yves/checkout/summary/summary.page";

export class PlaceCustomerOrderScenario {
  static execute = (productSkus: string[]) => {
    const cartPage = new CartPage();
    const addressStepPage = new AddressPage();
    const shipmentStepPage = new ShipmentPage();
    const paymentStepPage = new PaymentPage();
    const summaryStepPage = new SummaryPage();

    cy.visit(cartPage.PAGE_URL);
    productSkus.forEach((productSku: string) => {
      cartPage.quickAddToCart(productSku, 1);
    });

    cartPage.startCheckout();
    addressStepPage.fillShippingAddress();
    shipmentStepPage.setStandardShippingMethod();
    paymentStepPage.setDummyPaymentMethod();
    summaryStepPage.placeOrder();
  };
}
