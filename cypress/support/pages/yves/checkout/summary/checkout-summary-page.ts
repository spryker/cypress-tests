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

  // The order-success page carries the reference only as schema.org metadata, which is the sole
  // handle a guest has on the order it just placed: there is no order history to read it back from.
  getPlacedOrderReference = (): Cypress.Chainable<string> =>
    cy.get('meta[itemprop="identifier"]', { timeout: 15000 }).invoke('attr', 'content');

  requestApproval = (idCompanyUser: number): void => {
    this.repository.getApproverSelect().select(idCompanyUser.toString(), { force: true });
    this.repository.getSendApprovalRequestButton().click();
  };

  getApprovalStatus = (): Cypress.Chainable => this.repository.getApprovalStatus();

  getCancelApprovalRequestButton = (): Cypress.Chainable => this.repository.getCancelApprovalRequestButton();

  placeOrder = (): void => {
    this.repository.getaAcceptTermsAndConditionsCheckbox().should('be.visible', { timeout: 1000 });
    this.repository.getaAcceptTermsAndConditionsCheckbox().check({ force: true });
    this.repository.getSummaryForm().submit();
  };
}
