import { container } from '@utils';
import { RecurringOrderReviewStaticFixtures, RecurringOrderReviewDynamicFixtures } from '@interfaces/yves';
import { RecurringOrderDetailPage, RecurringOrderReviewPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'recurring order review page',
  { tags: ['@yves', '@recurring-orders', 'recurring-orders', 'spryker-core'] },
  (): void => {
    if (['b2c', 'b2c-mp', 'b2b', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite', () => {});
      return;
    }

    const customerLoginScenario = container.get(CustomerLoginScenario);
    const recurringOrderReviewPage = container.get(RecurringOrderReviewPage);
    const recurringOrderDetailPage = container.get(RecurringOrderDetailPage);

    let staticFixtures: RecurringOrderReviewStaticFixtures;
    let dynamicFixtures: RecurringOrderReviewDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('review page displays the schedule name, summary banner, back link, and footer total', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.buyer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      recurringOrderReviewPage.visitReview(dynamicFixtures.schedule.uuid);

      recurringOrderReviewPage.assertSummaryBannerVisible();
      recurringOrderReviewPage.assertBackToDetailLinkVisible();
      recurringOrderReviewPage.assertFooterTotalVisible();
    });

    it('back-to-detail link navigates to the schedule detail page', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.buyer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      recurringOrderReviewPage.visitReview(dynamicFixtures.schedule.uuid);

      recurringOrderReviewPage.clickBackToDetail();

      cy.url().should('include', `/recurring-orders/${dynamicFixtures.schedule.uuid}`);
    });

    it('accepting the review via confirmation modal submits and redirects away from the review page', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.buyer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      recurringOrderReviewPage.visitReview(dynamicFixtures.schedule.uuid);

      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.confirmApproveReview();

      cy.url().should('not.include', '/review-required');
    });

    it('order placed from review page for a bundle product shows history entry with view order link', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.buyerForBundle.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForBundle.uuid);
      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.confirmApproveReview();

      cy.url().should('not.include', '/review-required');

      recurringOrderDetailPage.visitDetail(dynamicFixtures.scheduleForBundle.uuid);
      recurringOrderDetailPage.assertHistoryViewOrderLinkVisible();
    });

    it('order placed from review page for a merchant product offer shows history entry with view order link', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.buyerForOffer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForOffer.uuid);
      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.confirmApproveReview();

      cy.url().should('not.include', '/review-required');

      recurringOrderDetailPage.visitDetail(dynamicFixtures.scheduleForOffer.uuid);
      recurringOrderDetailPage.assertHistoryViewOrderLinkVisible();
    });
  }
);
