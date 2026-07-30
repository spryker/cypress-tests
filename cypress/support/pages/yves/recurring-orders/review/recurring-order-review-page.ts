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

  selectStandingScope = (): void => {
    this.repository.getScopeOption('standing').check({ force: true });
  };

  selectOccurrenceScope = (): void => {
    this.repository.getScopeOption('occurrence').check({ force: true });
  };

  confirmApproveReview = (): void => {
    this.repository.getApproveSubmitButton().click();
  };

  assertModalRemovedCount = (count: number): void => {
    this.repository.getModalRemovedCount().should('have.text', String(count));
  };

  assertModalPriceChangeCount = (count: number): void => {
    this.repository.getModalPriceChangeCount().should('have.text', String(count));
  };

  assertModalSubstitutedCount = (count: number): void => {
    this.repository.getModalSubstitutedCount().should('have.text', String(count));
  };

  assertModalAddedCount = (count: number): void => {
    this.repository.getModalAddedCount().should('have.text', String(count));
  };

  assertOrderPlaced = (): void => {
    cy.url().should('not.include', '/review-required');
  };

  assertStillOnReview = (uuid: string): void => {
    cy.url().should('include', `/recurring-orders/${uuid}/review-required`);
  };

  assertApprovalErrorContains = (text: string): void => {
    this.repository.getFlashAlert().should('contain', text);
  };

  removeAllLines = (): void => {
    this.repository.getLineRemoveToggle().each(($toggle): void => {
      cy.wrap($toggle).click();
    });
  };

  assertScheduleDetailUrl = (uuid: string): void => {
    cy.url().should('include', `/recurring-orders/${uuid}`);
  };

  interceptShipmentMethods = (): void => {
    cy.intercept('GET', '**/shipment-methods*').as('shipmentMethods');
  };

  waitForShipmentMethods = (): void => {
    cy.wait('@shipmentMethods');
  };

  assertSummaryBannerContains = (text: string): void => {
    this.repository.getSummaryBanner().contains(text).should('be.visible');
  };

  assertFlaggedItemsVisible = (): void => {
    this.repository.getFlaggedItems().should('be.visible');
  };

  setLineQuantity = (quantity: number): void => {
    this.repository.getLineQuantityInput().first().clear().type(String(quantity)).blur();
  };

  typeLineQuantity = (quantity: string): void => {
    this.repository.getLineQuantityInput().first().clear().type(quantity).blur();
  };

  assertSubmittedLineQuantity = (quantity: number): void => {
    this.repository.getLineAcceptedQuantityInput().first().should('have.value', String(quantity));
  };

  removeFirstLine = (): void => {
    this.repository.getLineRemoveToggle().first().click();
  };

  assertCostCenterSelectVisible = (): void => {
    this.repository.getCostCenterSelect().should('be.visible');
  };

  assertBudgetSelectVisible = (): void => {
    this.repository.getBudgetSelect().should('be.visible');
  };

  assertBudgetSummaryVisible = (): void => {
    this.repository.getBudgetSummaryTotal().should('be.visible');
    this.repository.getBudgetSummaryRemaining().should('be.visible');
  };

  selectCostCenter = (): void => {
    this.selectFirstRealOption(this.repository.getCostCenterSelect);
  };

  selectBudget = (): void => {
    this.selectFirstRealOption(this.repository.getBudgetSelect);
  };

  assertSubstituteVisible = (): void => {
    this.repository.getSubstituteChangeButton().should('be.visible');
  };

  openSubstitutePicker = (): void => {
    this.repository.getSubstituteChangeButton().first().click();
  };

  confirmSubstitute = (): void => {
    this.repository.getSubstituteConfirmButton().filter(':visible').first().click();
  };

  assertSubstituteApplied = (): void => {
    this.repository.getSubstituteRemoveButton().filter(':visible').should('have.length.at.least', 1);
  };

  openAddProductModal = (): void => {
    this.repository.getAddProductOpenModalButton().click();
  };

  searchAndSelectProduct = (sku: string): void => {
    this.repository.getAddProductSearchInput().filter(':visible').first().clear().type(sku);
    this.repository.getAddProductSuggestion().filter(':visible').first().click();
  };

  selectAddProductOffer = (): void => {
    this.selectFirstRealOption(() => this.repository.getAddProductOfferSelect().filter(':visible').first());
  };

  setAddProductQuantity = (quantity: number): void => {
    this.repository.getAddProductPickerQuantityInput().filter(':visible').first().clear().type(String(quantity)).blur();
  };

  submitAddProduct = (): void => {
    this.repository.getAddProductPickerSubmitButton().filter(':visible').first().click();
  };

  assertAddProductLineVisible = (): void => {
    this.repository.getAddProductLine().should('be.visible');
  };

  typeSubstituteQuantity = (quantity: string): void => {
    this.repository.getSubstituteQuantityInput().filter(':visible').first().clear().type(quantity).blur();
  };

  assertSubstituteQuantity = (quantity: number): void => {
    this.repository.getSubstituteQuantityInput().filter(':visible').first().should('have.value', String(quantity));
  };

  typeAddProductQuantity = (quantity: string): void => {
    this.repository.getAddProductPickerQuantityInput().filter(':visible').first().clear().type(quantity).blur();
  };

  assertAddProductQuantity = (quantity: number): void => {
    this.repository
      .getAddProductPickerQuantityInput()
      .filter(':visible')
      .first()
      .should('have.value', String(quantity));
  };

  typeAddProductLineQuantity = (quantity: string): void => {
    this.repository.getAddProductLineQuantityInput().first().clear().type(quantity).blur();
  };

  assertAddProductLineQuantity = (quantity: number): void => {
    this.repository.getAddProductLineQuantityInput().first().should('have.value', String(quantity));
  };

  /** Asserts the value actually posted for an added item (substitute or added product), not the visible control. */
  assertSubmittedAddedItemQuantity = (quantity: number): void => {
    this.repository.getAddedItemQuantityFields().first().should('have.value', String(quantity));
  };

  selectShipmentAddress = (): void => {
    this.selectFirstRealOption(() => this.repository.getShipmentAddressSelect().filter(':visible').first());
  };

  selectShipmentMethod = (): void => {
    this.selectFirstRealOption(() => this.repository.getShipmentMethodSelect().filter(':visible').first());
  };

  private selectFirstRealOption = (getSelect: () => Cypress.Chainable): void => {
    getSelect()
      .find('option')
      .then(($options): void => {
        const value = $options
          .toArray()
          .map((option) => (option as HTMLOptionElement).value)
          .find((optionValue) => optionValue !== '');

        getSelect().select(String(value));
      });
  };
}
