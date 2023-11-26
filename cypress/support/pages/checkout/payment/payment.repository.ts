export class PaymentRepository {
    getDummyPaymentInvoiceRadio = () => {
        return cy.get('#paymentForm_paymentSelection_dummyPaymentInvoice');
    }

    getDummyPaymentInvoiceDateField = () => {
        return cy.get('#paymentForm_dummyPaymentInvoice_date_of_birth');
    }

    getGoToSummaryButton = () => {
        return cy.contains('button', 'Go to Summary');
    }
}
