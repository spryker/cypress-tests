// Marketplace repositories expose the dummy invoice payment under a different key than the
// non-marketplace ones, so every checkout that picks a payment method has to branch on the
// repository under test.
const MARKETPLACE_REPOSITORY_IDS = ['b2c-mp', 'b2b-mp'];

const MARKETPLACE_PAYMENT_METHOD = 'dummyMarketplacePaymentInvoice';

const PAYMENT_METHOD = 'dummyPaymentInvoice';

export function getPaymentMethodBasedOnEnv(): string {
  return MARKETPLACE_REPOSITORY_IDS.includes(Cypress.env('repositoryId')) ? MARKETPLACE_PAYMENT_METHOD : PAYMENT_METHOD;
}
