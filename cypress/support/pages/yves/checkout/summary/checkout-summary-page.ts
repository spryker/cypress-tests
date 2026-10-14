import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { CheckoutSummaryRepository } from './checkout-summary-repository';

@injectable()
@autoWired
export class CheckoutSummaryPage extends YvesPage {
  @inject(REPOSITORIES.CheckoutSummaryRepository) private repository: CheckoutSummaryRepository;

  protected PAGE_URL = '/checkout/summary';

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
    // The b2c themes render a styled checkbox over a transparent native input, which Cypress never reports
    // as visible; presence is what every theme shares.
    this.repository.getaAcceptTermsAndConditionsCheckbox().should('exist');
    this.repository.getaAcceptTermsAndConditionsCheckbox().check({ force: true });
    this.repository.getSummaryForm().submit();
  };
}
