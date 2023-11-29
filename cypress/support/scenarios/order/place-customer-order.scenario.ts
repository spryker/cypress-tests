import { CartPage } from "../../pages/cart/cart.page";
import { AddressPage } from "../../pages/checkout/address/address.page";
import { ShipmentPage } from "../../pages/checkout/shipment/shipment.page";
import { PaymentPage } from "../../pages/checkout/payment/payment.page";
import { SummaryPage } from "../../pages/checkout/summary/summary.page";

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
    }
}
