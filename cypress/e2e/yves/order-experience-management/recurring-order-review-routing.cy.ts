import { container } from '@utils';
import {
  RecurringOrderReviewRoutingStaticFixtures,
  RecurringOrderReviewRoutingDynamicFixtures,
} from '@interfaces/yves';
import { RecurringOrderDetailPage, RecurringOrderReviewPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'recurring order review routing',
  { tags: ['@yves', '@order-experience-management', 'order-experience-management', 'spryker-core'] },
  (): void => {
    if (['b2c', 'b2c-mp', 'b2b'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b-mp', () => {});

      return;
    }

    const customerLoginScenario = container.get(CustomerLoginScenario);
    const recurringOrderReviewPage = container.get(RecurringOrderReviewPage);
    const recurringOrderDetailPage = container.get(RecurringOrderDetailPage);

    let staticFixtures: RecurringOrderReviewRoutingStaticFixtures;
    let dynamicFixtures: RecurringOrderReviewRoutingDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      cy.runCliCommands([
        'console state-machine:check-condition RecurringOrder',
        'console state-machine:check-condition RecurringOrder',
      ]);
    });

    function loginAs(email: string): void {
      customerLoginScenario.execute({
        email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });
    }

    it('moves the schedule to review when a price drift is combined with a soft budget warning', (): void => {
      loginAs(dynamicFixtures.buyerWithDriftAndWarnBudget.email);

      recurringOrderDetailPage.visitDetail(dynamicFixtures.scheduleWithDriftAndWarnBudget.uuid);
      recurringOrderDetailPage.getStatusBadge().should('contain', staticFixtures.reviewRequiredStatus);

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleWithDriftAndWarnBudget.uuid);
      recurringOrderReviewPage.getSummaryBanner().should('contain', staticFixtures.priceChangeSummary);
      recurringOrderReviewPage.getFlaggedItems().should('be.visible');
      recurringOrderReviewPage.getBlockingErrors().should('contain', staticFixtures.budgetExceededError);
    });

    it('moves the schedule to review when the budget blocks placement and no price drifted', (): void => {
      loginAs(dynamicFixtures.buyerWithBlockBudget.email);

      recurringOrderDetailPage.visitDetail(dynamicFixtures.scheduleWithBlockBudget.uuid);
      recurringOrderDetailPage.getStatusBadge().should('contain', staticFixtures.reviewRequiredStatus);

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleWithBlockBudget.uuid);
      recurringOrderReviewPage.getBlockingErrors().should('contain', staticFixtures.budgetExceededError);

      recurringOrderReviewPage.getSummaryBanner().should('not.exist');
    });

    it('places the order without review when the only checkout error is a soft budget warning', (): void => {
      loginAs(dynamicFixtures.buyerWithWarnBudgetOnly.email);

      recurringOrderDetailPage.visitDetail(dynamicFixtures.scheduleWithWarnBudgetOnly.uuid);

      recurringOrderDetailPage.getStatusBadge().should('not.contain', staticFixtures.reviewRequiredStatus);
      recurringOrderDetailPage.getHistoryViewOrderLink().should('be.visible');
      recurringOrderDetailPage.assertHistoryViewRecordStatus('Completed');
    });
  }
);
