import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { RecurringOrderReviewRepository } from './recurring-order-review-repository';

@injectable()
@autoWired
export class RecurringOrderReviewPage extends YvesPage {
  @inject(REPOSITORIES.YvesRecurringOrderReviewRepository)
  private repository: RecurringOrderReviewRepository;

  protected PAGE_URL = '/recurring-orders';

  visitReview = (uuid: string): void => {
    cy.visit(`/recurring-orders/${uuid}/review-required`);
  };

  getSummaryBanner = (): Cypress.Chainable => this.repository.getSummaryBanner();

  getBackToDetailLink = (): Cypress.Chainable => this.repository.getBackToDetailLink();

  getFooterTotal = (): Cypress.Chainable => this.repository.getFooterTotal();

  getFlaggedItems = (): Cypress.Chainable => this.repository.getFlaggedItems();

  clickBackToDetail = (): void => {
    this.repository.getBackToDetailLink().click();
  };

  clickAcceptAndPlaceOrder = (): void => {
    this.repository.getAcceptCta().click();
  };

  confirmApproveReview = (): void => {
    this.repository.getApproveSubmitButton().click();
  };
}
