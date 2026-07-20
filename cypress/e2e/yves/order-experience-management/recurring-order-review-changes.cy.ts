import { container } from '@utils';
import {
  RecurringOrderReviewChangesStaticFixtures,
  RecurringOrderReviewChangesDynamicFixtures,
} from '@interfaces/yves';
import { RecurringOrderDetailPage, RecurringOrderReviewPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'recurring order review changes',
  { tags: ['@yves', '@order-experience-management', 'order-experience-management', 'spryker-core'] },
  (): void => {
    if (['b2c', 'b2c-mp', 'b2b', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite', () => {});

      return;
    }

    const customerLoginScenario = container.get(CustomerLoginScenario);
    const recurringOrderReviewPage = container.get(RecurringOrderReviewPage);
    const recurringOrderDetailPage = container.get(RecurringOrderDetailPage);

    let staticFixtures: RecurringOrderReviewChangesStaticFixtures;
    let dynamicFixtures: RecurringOrderReviewChangesDynamicFixtures;

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

    it('company user can assign a cost center and budget on the review page and place the order', (): void => {
      loginAs(dynamicFixtures.buyerForBudget.email);

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForBudget.uuid);

      recurringOrderReviewPage.assertCostCenterSelectVisible();
      recurringOrderReviewPage.assertBudgetSelectVisible();
      recurringOrderReviewPage.selectCostCenter();
      recurringOrderReviewPage.selectBudget();
      recurringOrderReviewPage.assertBudgetSummaryVisible();

      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.selectStandingScope();
      recurringOrderReviewPage.confirmApproveReview();

      recurringOrderReviewPage.assertOrderPlaced();
    });

    it('company user can change a line quantity and apply it to all future orders (standing scope)', (): void => {
      loginAs(dynamicFixtures.buyerForQuantity.email);

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForQuantity.uuid);
      recurringOrderReviewPage.assertFlaggedItemsVisible();

      recurringOrderReviewPage.setLineQuantity(staticFixtures.updatedQuantity);

      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.selectStandingScope();
      recurringOrderReviewPage.confirmApproveReview();

      recurringOrderReviewPage.assertOrderPlaced();

      recurringOrderDetailPage.visitDetail(dynamicFixtures.scheduleForQuantity.uuid);
      recurringOrderDetailPage.assertDetailItemQuantity(String(staticFixtures.updatedQuantity));
    });

    it('company user can remove a line for this occurrence only and the standing schedule keeps the item', (): void => {
      loginAs(dynamicFixtures.buyerForRemoval.email);

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForRemoval.uuid);
      recurringOrderReviewPage.assertFlaggedItemsVisible();

      recurringOrderReviewPage.removeFirstLine();

      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.selectOccurrenceScope();
      recurringOrderReviewPage.confirmApproveReview();

      recurringOrderReviewPage.assertOrderPlaced();

      recurringOrderDetailPage.visitDetail(dynamicFixtures.scheduleForRemoval.uuid);
      recurringOrderDetailPage.assertDetailItemsContain(dynamicFixtures.productFlaggedForRemoval.sku);
    });

    it('company user can substitute a discontinued product and place the order', (): void => {
      recurringOrderReviewPage.interceptShipmentMethods();

      loginAs(dynamicFixtures.buyerForSubstitute.email);

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForSubstitute.uuid);
      recurringOrderReviewPage.assertSubstituteVisible();

      recurringOrderReviewPage.openSubstitutePicker();
      recurringOrderReviewPage.selectShipmentAddress();
      recurringOrderReviewPage.waitForShipmentMethods();
      recurringOrderReviewPage.selectShipmentMethod();
      recurringOrderReviewPage.confirmSubstitute();
      recurringOrderReviewPage.assertSubstituteApplied();

      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.selectStandingScope();
      recurringOrderReviewPage.confirmApproveReview();

      recurringOrderReviewPage.assertOrderPlaced();

      recurringOrderDetailPage.visitDetail(dynamicFixtures.scheduleForSubstitute.uuid);
      recurringOrderDetailPage.assertDetailItemsContain(dynamicFixtures.substituteProduct.sku);
      recurringOrderDetailPage.assertDetailItemsNotContain(dynamicFixtures.discontinuedProduct.sku);
    });

    it('company user can add a product with merchant, address and shipment and place the order', (): void => {
      recurringOrderReviewPage.interceptShipmentMethods();

      loginAs(dynamicFixtures.buyerForAddProduct.email);
      cy.runQueueWorker();

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForAddProduct.uuid);

      recurringOrderReviewPage.openAddProductModal();
      recurringOrderReviewPage.searchAndSelectProduct(dynamicFixtures.addProduct.sku);
      recurringOrderReviewPage.selectAddProductOffer();
      recurringOrderReviewPage.selectShipmentAddress();
      recurringOrderReviewPage.waitForShipmentMethods();
      recurringOrderReviewPage.selectShipmentMethod();
      recurringOrderReviewPage.submitAddProduct();
      recurringOrderReviewPage.assertAddProductLineVisible();

      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.selectStandingScope();
      recurringOrderReviewPage.confirmApproveReview();

      recurringOrderReviewPage.assertOrderPlaced();

      recurringOrderDetailPage.visitDetail(dynamicFixtures.scheduleForAddProduct.uuid);
      recurringOrderDetailPage.assertDetailItemsContain(dynamicFixtures.addProduct.sku);
    });
  }
);
