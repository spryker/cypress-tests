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

  assertSummaryBannerVisible = (): void => {
    this.repository.getSummaryBanner().should('be.visible');
  };

  assertBackToDetailLinkVisible = (): void => {
    this.repository.getBackToDetailLink().should('be.visible');
  };

  clickBackToDetail = (): void => {
    this.repository.getBackToDetailLink().click();
  };

  assertFooterTotalVisible = (): void => {
    this.repository.getFooterTotal().should('be.visible');
  };

  clickAcceptAndPlaceOrder = (): void => {
    this.repository.getAcceptCta().click();
  };

  confirmApproveReview = (): void => {
    this.repository.getApproveSubmitButton().click();
  };

  assertSummaryBannerContains = (text: string): void => {
    this.repository.getSummaryBanner().contains(text).should('be.visible');
  };

  assertFlaggedItemsVisible = (): void => {
    this.repository.getFlaggedItems().should('be.visible');
  };
}
