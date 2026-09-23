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

  clickBackToDetail = (): void => {
    this.repository.getBackToDetailLink().click();
  };

  getFooterTotal = (): Cypress.Chainable => this.repository.getFooterTotal();

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

  getModalRemovedCount = (): Cypress.Chainable => this.repository.getModalRemovedCount();

  getModalPriceChangeCount = (): Cypress.Chainable => this.repository.getModalPriceChangeCount();

  getModalSubstitutedCount = (): Cypress.Chainable => this.repository.getModalSubstitutedCount();

  getModalAddedCount = (): Cypress.Chainable => this.repository.getModalAddedCount();

  getFlashAlert = (): Cypress.Chainable => this.repository.getFlashAlert();

  removeAllLines = (): void => {
    this.repository.getLineRemoveToggle().each(($toggle): void => {
      cy.wrap($toggle).click();
    });
  };

  interceptShipmentMethods = (): void => {
    cy.intercept('GET', '**/shipment-methods*').as('shipmentMethods');
  };

  waitForShipmentMethods = (): void => {
    cy.wait('@shipmentMethods');
  };

  getFlaggedItems = (): Cypress.Chainable => this.repository.getFlaggedItems();

  getBlockingErrors = (): Cypress.Chainable => this.repository.getBlockingErrors();

  setLineQuantity = (quantity: number): void => {
    this.repository.getLineQuantityInput().first().clear().type(String(quantity)).blur();
  };

  typeLineQuantity = (quantity: string): void => {
    this.repository.getLineQuantityInput().first().clear().type(quantity).blur();
  };

  /** The field carrying the quantity actually posted for the first line, not the visible control. */
  getLineAcceptedQuantityInput = (): Cypress.Chainable => this.repository.getLineAcceptedQuantityInput().first();

  removeFirstLine = (): void => {
    this.repository.getLineRemoveToggle().first().click();
  };

  getCostCenterSelect = (): Cypress.Chainable => this.repository.getCostCenterSelect();

  getBudgetSelect = (): Cypress.Chainable => this.repository.getBudgetSelect();

  getBudgetSummaryTotal = (): Cypress.Chainable => this.repository.getBudgetSummaryTotal();

  getBudgetSummaryRemaining = (): Cypress.Chainable => this.repository.getBudgetSummaryRemaining();

  selectCostCenter = (): void => {
    this.selectFirstRealOption(this.repository.getCostCenterSelect);
  };

  selectBudget = (): void => {
    this.selectFirstRealOption(this.repository.getBudgetSelect);
  };

  getSubstituteChangeButton = (): Cypress.Chainable => this.repository.getSubstituteChangeButton();

  openSubstitutePicker = (): void => {
    this.repository.getSubstituteChangeButton().first().click();
  };

  confirmSubstitute = (): void => {
    this.repository.getSubstituteConfirmButton().filter(':visible').first().click();
  };

  /**
   * Substitute and add-product controls are rendered per line as well as inside the open modal, so the page
   * object narrows to the copy the spec interacts with instead of leaking the filter into the spec.
   */
  getSubstituteRemoveButtons = (): Cypress.Chainable => this.repository.getSubstituteRemoveButton().filter(':visible');

  openAddProductModal = (): void => {
    this.repository.getAddProductOpenModalButton().click();
  };

  searchAndSelectProduct = (sku: string): void => {
    cy.intercept('GET', '**/recurring-order/product-offer-select*').as('productOffers');
    this.repository.getAddProductSearchInput().filter(':visible').first().clear().type(sku);
    this.repository.getAddProductSuggestion().filter(':visible').first().click();
    cy.wait('@productOffers');
  };

  selectAddProductOffer = (): void => {
    this.selectFirstRealOption(this.repository.getAddProductOfferSelect);
  };

  setAddProductQuantity = (quantity: number): void => {
    this.getAddProductQuantityInput().clear().type(String(quantity)).blur();
  };

  submitAddProduct = (): void => {
    this.repository.getAddProductPickerSubmitButton().filter(':visible').first().click();
  };

  getAddProductLine = (): Cypress.Chainable => this.repository.getAddProductLine();

  typeSubstituteQuantity = (quantity: string): void => {
    this.getSubstituteQuantityInput().clear().type(quantity).blur();
  };

  getSubstituteQuantityInput = (): Cypress.Chainable =>
    this.repository.getSubstituteQuantityInput().filter(':visible').first();

  typeAddProductQuantity = (quantity: string): void => {
    this.getAddProductQuantityInput().clear().type(quantity).blur();
  };

  getAddProductQuantityInput = (): Cypress.Chainable =>
    this.repository.getAddProductPickerQuantityInput().filter(':visible').first();

  typeAddProductLineQuantity = (quantity: string): void => {
    this.getAddProductLineQuantityInput().clear().type(quantity).blur();
  };

  getAddProductLineQuantityInput = (): Cypress.Chainable => this.repository.getAddProductLineQuantityInput().first();

  /** The field carrying the quantity actually posted for an added item (substitute or added product). */
  getAddedItemQuantityField = (): Cypress.Chainable => this.repository.getAddedItemQuantityFields().first();

  selectShipmentAddress = (): void => {
    this.selectFirstRealOption(this.repository.getShipmentAddressSelect);
  };

  selectShipmentMethod = (): void => {
    this.selectFirstRealOption(this.repository.getShipmentMethodSelect);
  };

  private selectFirstRealOption = (getSelect: () => Cypress.Chainable): void => {
    getSelect()
      .find('option')
      .then(($options): void => {
        const value = $options
          .toArray()
          .map((option) => (option as HTMLOptionElement).value)
          .find((optionValue) => optionValue !== '');

        getSelect().select(String(value), { force: true });
      });
  };
}
