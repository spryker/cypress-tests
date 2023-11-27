import {PaymentRepository} from "./payment.repository";
import {Page} from "../../shared/page";

export class PaymentPage extends Page
{
    PAGE_URL = '/checkout/payment';
    repository: PaymentRepository;

    constructor()
    {
        super();
        this.repository = new PaymentRepository();
    }

    setDummyPaymentMethod = () => {
        this.repository.getDummyPaymentInvoiceRadio().click({force: true});
        this.repository.getDummyPaymentInvoiceDateField().clear().type('12.12.1999');

        this.repository.getGoToSummaryButton().click();
    };
}
