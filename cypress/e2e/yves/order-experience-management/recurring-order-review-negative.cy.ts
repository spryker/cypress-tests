import { container } from '@utils';
import {
  RecurringOrderReviewNegativeStaticFixtures,
  RecurringOrderReviewNegativeDynamicFixtures,
} from '@interfaces/yves';
import { RecurringOrderDetailPage, RecurringOrderReviewPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'recurring order review negative cases',
  { tags: ['@yves', '@order-experience-management', 'order-experience-management', 'spryker-core'] },
  (): void => {
    if (['b2c', 'b2c-mp', 'b2b', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite', () => {});

      return;
    }

    const customerLoginScenario = container.get(CustomerLoginScenario);
    const recurringOrderReviewPage = container.get(RecurringOrderReviewPage);
    const recurringOrderDetailPage = container.get(RecurringOrderDetailPage);

    let staticFixtures: RecurringOrderReviewNegativeStaticFixtures;
    let dynamicFixtures: RecurringOrderReviewNegativeDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    function loginAs(email: string): void {
      customerLoginScenario.execute({
        email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
      });
    }

    it('blocks approval when an added product quantity exceeds the available warehouse stock', (): void => {
      recurringOrderReviewPage.interceptShipmentMethods();

      loginAs(dynamicFixtures.buyerForOverStock.email);

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForOverStock.uuid);

      recurringOrderReviewPage.openAddProductModal();
      recurringOrderReviewPage.searchAndSelectProduct(dynamicFixtures.productForOverStock.sku);
      recurringOrderReviewPage.selectAddProductOffer();
      recurringOrderReviewPage.selectShipmentAddress();
      recurringOrderReviewPage.waitForShipmentMethods();
      recurringOrderReviewPage.selectShipmentMethod();
      recurringOrderReviewPage.setAddProductQuantity(staticFixtures.overStockQuantity);
      recurringOrderReviewPage.submitAddProduct();
      recurringOrderReviewPage.assertAddProductLineVisible();

      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.selectStandingScope();
      recurringOrderReviewPage.confirmApproveReview();

      recurringOrderReviewPage.assertStillOnReview(dynamicFixtures.scheduleForOverStock.uuid);
      recurringOrderReviewPage.assertApprovalErrorContains(staticFixtures.notAvailableError);
    });

    it('blocks approval when all items are removed from the schedule', (): void => {
      loginAs(dynamicFixtures.buyerForRemoveAll.email);

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForRemoveAll.uuid);
      recurringOrderReviewPage.assertFlaggedItemsVisible();

      recurringOrderReviewPage.removeAllLines();

      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.selectStandingScope();
      recurringOrderReviewPage.confirmApproveReview();

      recurringOrderReviewPage.assertStillOnReview(dynamicFixtures.scheduleForRemoveAll.uuid);
      recurringOrderReviewPage.assertApprovalErrorContains(staticFixtures.allItemsRemovedError);
    });

    it('blocks approval and surfaces an error when an added product is out of stock', (): void => {
      recurringOrderReviewPage.interceptShipmentMethods();

      loginAs(dynamicFixtures.buyerForUnavailable.email);

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForUnavailable.uuid);

      recurringOrderReviewPage.openAddProductModal();
      recurringOrderReviewPage.searchAndSelectProduct(dynamicFixtures.productForUnavailable.sku);
      recurringOrderReviewPage.selectAddProductOffer();
      recurringOrderReviewPage.selectShipmentAddress();
      recurringOrderReviewPage.waitForShipmentMethods();
      recurringOrderReviewPage.selectShipmentMethod();
      recurringOrderReviewPage.setAddProductQuantity(staticFixtures.overStockQuantity);
      recurringOrderReviewPage.submitAddProduct();
      recurringOrderReviewPage.assertAddProductLineVisible();

      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.selectStandingScope();
      recurringOrderReviewPage.confirmApproveReview();

      recurringOrderReviewPage.assertStillOnReview(dynamicFixtures.scheduleForUnavailable.uuid);
      recurringOrderReviewPage.assertApprovalErrorContains(staticFixtures.notAvailableError);
    });

    it('surfaces a budget error on the detail page when the selected budget is exceeded', (): void => {
      loginAs(dynamicFixtures.buyerForBudgetBlock.email);

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForBudgetBlock.uuid);

      recurringOrderReviewPage.assertCostCenterSelectVisible();
      recurringOrderReviewPage.assertBudgetSelectVisible();
      recurringOrderReviewPage.selectCostCenter();
      recurringOrderReviewPage.selectBudget();

      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.selectStandingScope();
      recurringOrderReviewPage.confirmApproveReview();

      recurringOrderDetailPage.assertApprovalErrorContains(staticFixtures.budgetBlockError);
    });
  }
);
