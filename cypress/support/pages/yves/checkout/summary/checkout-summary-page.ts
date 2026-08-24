import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { CheckoutSummaryRepository } from './checkout-summary-repository';

@injectable()
@autoWired
export class CheckoutSummaryPage extends YvesPage {
  @inject(REPOSITORIES.CheckoutSummaryRepository) private repository: CheckoutSummaryRepository;

  protected PAGE_URL = '/checkout/summary';

  // Same core molecule the cart renders the surcharge with.
  getThresholdSurcharge = (): Cypress.Chainable => cy.get('[data-qa*="sales-order-threshold-expense"]');

  // The hard-threshold message is configured per test, so the text itself is the handle; no theme
  // renders it inside a stable container that is the same across shops.
  getThresholdMessage = (message: string): Cypress.Chainable => cy.contains(message);

  placeOrder = (): void => {
    this.repository.getaAcceptTermsAndConditionsCheckbox().should('be.visible', { timeout: 1000 });
    this.repository.getaAcceptTermsAndConditionsCheckbox().check({ force: true });
    this.repository.getSummaryForm().submit();
  };
}
