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
    if (['b2c', 'b2c-mp', 'b2b'].includes(Cypress.env('repositoryId'))) {
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

      recurringOrderReviewPage.getCostCenterSelect().should('be.visible');
      recurringOrderReviewPage.getBudgetSelect().should('be.visible');
      recurringOrderReviewPage.selectCostCenter();
      recurringOrderReviewPage.selectBudget();
      recurringOrderReviewPage.getBudgetSummaryTotal().should('be.visible');
      recurringOrderReviewPage.getBudgetSummaryRemaining().should('be.visible');

      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.selectStandingScope();
      recurringOrderReviewPage.confirmApproveReview();

      cy.url().should('not.include', '/review-required');
    });

    it('company user can change a line quantity and apply it to all future orders (standing scope)', (): void => {
      loginAs(dynamicFixtures.buyerForQuantity.email);

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForQuantity.uuid);
      recurringOrderReviewPage.getFlaggedItems().should('be.visible');

      recurringOrderReviewPage.setLineQuantity(staticFixtures.updatedQuantity);

      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.getModalPriceChangeCount().should('have.text', '1');
      recurringOrderReviewPage.selectStandingScope();
      recurringOrderReviewPage.confirmApproveReview();

      cy.url().should('not.include', '/review-required');

      recurringOrderDetailPage.visitDetail(dynamicFixtures.scheduleForQuantity.uuid);
      recurringOrderDetailPage.getDetailItemQuantity().should('contain', String(staticFixtures.updatedQuantity));
    });

    it('line quantity cannot be submitted as zero or negative', (): void => {
      loginAs(dynamicFixtures.buyerForQuantity.email);

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForQuantityValidation.uuid);
      recurringOrderReviewPage.getFlaggedItems().should('be.visible');

      recurringOrderReviewPage.typeLineQuantity('0');
      recurringOrderReviewPage.getLineAcceptedQuantityInput().should('have.value', '1');

      recurringOrderReviewPage.typeLineQuantity('-5');
      recurringOrderReviewPage.getLineAcceptedQuantityInput().should('have.value', '1');
    });

    it('company user can remove a line for this occurrence only and the standing schedule keeps the item', (): void => {
      loginAs(dynamicFixtures.buyerForRemoval.email);

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForRemoval.uuid);
      recurringOrderReviewPage.getFlaggedItems().should('be.visible');

      recurringOrderReviewPage.removeFirstLine();

      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.getModalRemovedCount().should('have.text', '1');
      recurringOrderReviewPage.getModalPriceChangeCount().should('have.text', '0');
      recurringOrderReviewPage.selectOccurrenceScope();
      recurringOrderReviewPage.confirmApproveReview();

      cy.url().should('not.include', '/review-required');

      recurringOrderDetailPage.visitDetail(dynamicFixtures.scheduleForRemoval.uuid);
      recurringOrderDetailPage.getDetailItems().should('contain', dynamicFixtures.productFlaggedForRemoval.sku);
    });

    it('company user can substitute a discontinued product and place the order', (): void => {
      recurringOrderReviewPage.interceptShipmentMethods();

      loginAs(dynamicFixtures.buyerForSubstitute.email);

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForSubstitute.uuid);
      recurringOrderReviewPage.getSubstituteChangeButton().should('be.visible');

      recurringOrderReviewPage.openSubstitutePicker();
      recurringOrderReviewPage.selectShipmentAddress();
      recurringOrderReviewPage.waitForShipmentMethods();
      recurringOrderReviewPage.selectShipmentMethod();
      recurringOrderReviewPage.confirmSubstitute();
      recurringOrderReviewPage.getSubstituteRemoveButtons().should('have.length.at.least', 1);

      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.getModalSubstitutedCount().should('have.text', '1');
      recurringOrderReviewPage.getModalRemovedCount().should('have.text', '0');
      recurringOrderReviewPage.selectStandingScope();
      recurringOrderReviewPage.confirmApproveReview();

      cy.url().should('not.include', '/review-required');

      recurringOrderDetailPage.visitDetail(dynamicFixtures.scheduleForSubstitute.uuid);
      recurringOrderDetailPage.getDetailItems().should('contain', dynamicFixtures.substituteProduct.sku);
      recurringOrderDetailPage.getDetailItems().should('not.contain', dynamicFixtures.discontinuedProduct.sku);
    });

    it('substitute quantity cannot be submitted as zero or negative', (): void => {
      recurringOrderReviewPage.interceptShipmentMethods();

      loginAs(dynamicFixtures.buyerForSubstitute.email);

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForSubstituteValidation.uuid);
      recurringOrderReviewPage.getSubstituteChangeButton().should('be.visible');

      recurringOrderReviewPage.openSubstitutePicker();
      recurringOrderReviewPage.selectShipmentAddress();
      recurringOrderReviewPage.waitForShipmentMethods();
      recurringOrderReviewPage.selectShipmentMethod();
      recurringOrderReviewPage.confirmSubstitute();
      recurringOrderReviewPage.getSubstituteRemoveButtons().should('have.length.at.least', 1);

      recurringOrderReviewPage.typeSubstituteQuantity('0');
      recurringOrderReviewPage.getSubstituteQuantityInput().should('have.value', '1');
      recurringOrderReviewPage.getAddedItemQuantityField().should('have.value', '1');

      recurringOrderReviewPage.typeSubstituteQuantity('-5');
      recurringOrderReviewPage.getSubstituteQuantityInput().should('have.value', '1');
      recurringOrderReviewPage.getAddedItemQuantityField().should('have.value', '1');
    });

    it('added product quantity cannot be submitted as zero or negative', (): void => {
      recurringOrderReviewPage.interceptShipmentMethods();

      loginAs(dynamicFixtures.buyerForAddProduct.email);

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForAddProductValidation.uuid);

      recurringOrderReviewPage.openAddProductModal();
      recurringOrderReviewPage.searchAndSelectProduct(dynamicFixtures.addProduct.sku);
      recurringOrderReviewPage.selectAddProductOffer();
      recurringOrderReviewPage.selectShipmentAddress();
      recurringOrderReviewPage.waitForShipmentMethods();
      recurringOrderReviewPage.selectShipmentMethod();

      recurringOrderReviewPage.typeAddProductQuantity('0');
      recurringOrderReviewPage.getAddProductQuantityInput().should('have.value', '1');
      recurringOrderReviewPage.typeAddProductQuantity('-5');
      recurringOrderReviewPage.getAddProductQuantityInput().should('have.value', '1');

      recurringOrderReviewPage.submitAddProduct();
      recurringOrderReviewPage.getAddProductLine().should('be.visible');

      recurringOrderReviewPage.typeAddProductLineQuantity('0');
      recurringOrderReviewPage.getAddProductLineQuantityInput().should('have.value', '1');
      recurringOrderReviewPage.getAddedItemQuantityField().should('have.value', '1');

      recurringOrderReviewPage.typeAddProductLineQuantity('-5');
      recurringOrderReviewPage.getAddProductLineQuantityInput().should('have.value', '1');
      recurringOrderReviewPage.getAddedItemQuantityField().should('have.value', '1');
    });

    it('company user can add a product with merchant, address and shipment and place the order', (): void => {
      recurringOrderReviewPage.interceptShipmentMethods();

      loginAs(dynamicFixtures.buyerForAddProduct.email);

      recurringOrderReviewPage.visitReview(dynamicFixtures.scheduleForAddProduct.uuid);

      recurringOrderReviewPage.openAddProductModal();
      recurringOrderReviewPage.searchAndSelectProduct(dynamicFixtures.addProduct.sku);
      recurringOrderReviewPage.selectAddProductOffer();
      recurringOrderReviewPage.selectShipmentAddress();
      recurringOrderReviewPage.waitForShipmentMethods();
      recurringOrderReviewPage.selectShipmentMethod();
      recurringOrderReviewPage.submitAddProduct();
      recurringOrderReviewPage.getAddProductLine().should('be.visible');

      recurringOrderReviewPage.clickAcceptAndPlaceOrder();
      recurringOrderReviewPage.getModalAddedCount().should('have.text', '1');
      recurringOrderReviewPage.selectStandingScope();
      recurringOrderReviewPage.confirmApproveReview();

      cy.url().should('not.include', '/review-required');

      recurringOrderDetailPage.visitDetail(dynamicFixtures.scheduleForAddProduct.uuid);
      recurringOrderDetailPage.getDetailItems().should('contain', dynamicFixtures.addProduct.sku);
    });
  }
);
