import { container } from '@utils';
import { RecurringOrderReviewStaticFixtures, RecurringOrderReviewDynamicFixtures } from '@interfaces/yves';
import { RecurringOrderDetailPage, RecurringOrderReviewPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'recurring order review page',
  { tags: ['@yves', '@order-experience-management', 'order-experience-management', 'spryker-core'] },
  (): void => {
    if (['b2c', 'b2c-mp', 'b2b'].includes(Cypress.env('repositoryId'))) {
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

    it('review page displays the schedule name, summary banner, back link, and footer total and user can go back to the details', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.buyer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      recurringOrderReviewPage.visitReview(dynamicFixtures.schedule.uuid);

      recurringOrderReviewPage.getSummaryBanner().should('be.visible');
      recurringOrderReviewPage.getBackToDetailLink().should('be.visible');
      recurringOrderReviewPage.getFooterTotal().should('be.visible');

      recurringOrderReviewPage.clickBackToDetail();

      cy.url().should('include', `/recurring-orders/${dynamicFixtures.schedule.uuid}`);
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
      recurringOrderDetailPage.getHistoryViewOrderLink().should('be.visible');
      recurringOrderDetailPage.assertHistoryViewRecordStatus('Completed');
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
      recurringOrderDetailPage.getHistoryViewOrderLink().should('be.visible');
      recurringOrderDetailPage.assertHistoryViewRecordStatus('Completed');
    });

    it('order placed from review page for a configurable bundle shows history entry with view order link', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.buyerForConfigurableBundle.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForConfigurableBundle.uuid);
      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.confirmApproveReview();

      cy.url().should('not.include', '/review-required');

      recurringOrderDetailPage.visitDetail(dynamicFixtures.scheduleForConfigurableBundle.uuid);
      recurringOrderDetailPage.getHistoryViewOrderLink().should('be.visible');
      recurringOrderDetailPage.assertHistoryViewRecordStatus('Completed');
    });

    it('order placed from review page for a configured product shows history entry with view order link', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.buyerForConfigurableProduct.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForConfigurableProduct.uuid);
      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.confirmApproveReview();

      cy.url().should('not.include', '/review-required');

      recurringOrderDetailPage.visitDetail(dynamicFixtures.scheduleForConfigurableProduct.uuid);
      recurringOrderDetailPage.getHistoryViewOrderLink().should('be.visible');
      recurringOrderDetailPage.assertHistoryViewRecordStatus('Completed');
    });

    it('review page shows price change banner and detail page reflects updated price after acceptance', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.buyerForPriceDrift.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForPriceDrift.uuid);

      recurringOrderReviewPage.getSummaryBanner().contains('1 price change').should('be.visible');
      recurringOrderReviewPage.getFlaggedItems().should('be.visible');

      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.confirmApproveReview();

      cy.url().should('not.include', '/review-required');

      recurringOrderDetailPage.visitDetail(dynamicFixtures.scheduleForPriceDrift.uuid);
      recurringOrderDetailPage.getDetailItems().should('contain', '350');
    });

    it('order placed from review page for a product with packaging unit shows history entry with view order link', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.buyerForPackagingUnit.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForPackagingUnit.uuid);
      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.confirmApproveReview();

      cy.url().should('not.include', '/review-required');

      recurringOrderDetailPage.visitDetail(dynamicFixtures.scheduleForPackagingUnit.uuid);
      recurringOrderDetailPage.getHistoryViewOrderLink().should('be.visible');
      recurringOrderDetailPage.assertHistoryViewRecordStatus('Completed');
    });

    it('review page shows unavailable banner and detail page excludes removed item after acceptance', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.buyerForStockDrift.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForStockDrift.uuid);

      recurringOrderReviewPage.getSummaryBanner().contains('1 unavailable').should('be.visible');
      recurringOrderReviewPage.getFlaggedItems().should('be.visible');

      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.confirmApproveReview();

      cy.url().should('not.include', '/review-required');

      recurringOrderDetailPage.visitDetail(dynamicFixtures.scheduleForStockDrift.uuid);
      recurringOrderDetailPage.getDetailItems().should('contain', dynamicFixtures.simpleProductForStockDrift.sku);
      recurringOrderDetailPage.getDetailItems().should('not.contain', dynamicFixtures.stockDriftProduct.sku);
    });
  }
);
