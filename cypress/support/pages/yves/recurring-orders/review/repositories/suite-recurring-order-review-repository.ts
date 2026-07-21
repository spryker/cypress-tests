import { injectable } from 'inversify';
import { RecurringOrderReviewRepository } from '../recurring-order-review-repository';

@injectable()
export class SuiteRecurringOrderReviewRepository implements RecurringOrderReviewRepository {
  getSummaryBanner = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-summary-banner"]');
  getBackToDetailLink = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-back-link"]');
  getFooterTotal = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-footer-total"]');
  getAcceptCta = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-accept-cta"]');
  getApproveSubmitButton = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-approve-submit"]');
  getFlaggedItems = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-flagged-items"]');
  getScopeOption = (scope: string): Cypress.Chainable => cy.get(`[data-qa="recurring-order-review-scope-${scope}"]`);
  getFlashAlert = (): Cypress.Chainable => cy.get('[data-qa~="flash-message-alert"]');

  getCostCenterSelect = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-cost-center-select"]');
  getBudgetSelect = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-budget-select"]');
  getBudgetSummaryUsed = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-budget-summary-used"]');
  getBudgetSummaryTotal = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-budget-summary-total"]');
  getBudgetSummaryRemaining = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-budget-summary-remaining"]');

  getLineQuantityInput = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-line-quantity"]');
  getLineRemoveToggle = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-line-remove-toggle"]');

  getSubstituteChangeButton = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-substitute-change"]');
  getSubstituteRemoveButton = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-substitute-remove"]');
  getSubstituteOption = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-substitute-option"]');
  getSubstituteQuantityInput = (): Cypress.Chainable =>
    cy.get('[data-qa="recurring-order-review-substitute-quantity"]');
  getSubstituteConfirmButton = (): Cypress.Chainable => cy.get('[data-qa="recurring-order-review-substitute-confirm"]');

  getAddProductOpenModalButton = (): Cypress.Chainable => cy.get('[data-qa="review-add-product-open-modal"]');
  getAddProductSearchInput = (): Cypress.Chainable =>
    cy.get('[data-qa="review-add-product-picker-search"]').find('input[type="text"]');
  getAddProductSuggestion = (): Cypress.Chainable =>
    cy.get('[data-qa="review-add-product-picker-search"]').find('[data-value]').first();
  getAddProductPickerPrice = (): Cypress.Chainable => cy.get('[data-qa="review-add-product-picker-price"]');
  getAddProductOfferSelect = (): Cypress.Chainable =>
    cy.get('[data-qa="review-add-product-picker-offer"]').find('select');
  getAddProductPickerQuantityInput = (): Cypress.Chainable => cy.get('[data-qa="review-add-product-picker-quantity"]');
  getAddProductPickerSubmitButton = (): Cypress.Chainable => cy.get('[data-qa="review-add-product-picker-submit"]');
  getAddProductLine = (): Cypress.Chainable => cy.get('[data-qa="review-add-product-line"]');

  getShipmentAddressSelect = (): Cypress.Chainable => cy.get('[data-qa="review-shipment-selection-address"]');
  getShipmentMethodSelect = (): Cypress.Chainable => cy.get('[data-qa="review-shipment-selection-method"]');
}
