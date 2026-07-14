import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { SmartPimRepository } from './smart-pim-repository';

@injectable()
@autoWired
export class SmartPimPage extends BackofficePage {
  @inject(SmartPimRepository) private repository: SmartPimRepository;

  protected PAGE_URL = '/product-management/edit';

  visitProductEdit = (idProductAbstract: number): Cypress.Chainable => {
    cy.intercept('GET', '**/product-management/edit?id-product-abstract=*').as('productEditDocument');
    cy.visitBackoffice(`${this.PAGE_URL}?id-product-abstract=${idProductAbstract}`);

    return cy.wait('@productEditDocument');
  };

  getRequestBuilderTriggers = (): Cypress.Chainable => cy.get(this.repository.getRequestBuilderTriggerSelector());

  getCategoryTrigger = (): Cypress.Chainable => cy.get(this.repository.getCategoryTriggerSelector());

  getAltImageTriggers = (): Cypress.Chainable => cy.get(this.repository.getAltImageTriggerSelector());

  getCategoryModal = (): Cypress.Chainable => cy.get(this.repository.getCategoryModalSelector());

  getAltTextModal = (): Cypress.Chainable => cy.get(this.repository.getAltTextModalSelector());

  getTranslationModal = (): Cypress.Chainable => cy.get(this.repository.getTranslationModalSelector());

  getAllActionsPopover = (): Cypress.Chainable => cy.get(this.repository.getAllActionsPopoverSelector());

  getLocaleSelectorPopover = (): Cypress.Chainable => cy.get(this.repository.getLocaleSelectorPopoverSelector());

  getSmartPimScript = (): Cypress.Chainable => cy.get(this.repository.getSmartPimScriptSelector());

  getRequestBuilderScript = (): Cypress.Chainable => cy.get(this.repository.getRequestBuilderScriptSelector());

  getTranslateActionButton = (): Cypress.Chainable => cy.get(this.repository.getTranslateActionButtonSelector());

  getImproveContentButton = (): Cypress.Chainable => cy.get(this.repository.getImproveContentButtonSelector());

  getLocaleButtons = (): Cypress.Chainable => cy.get(this.repository.getLocaleButtonSelector());

  getCategoryModalEmptyText = (): Cypress.Chainable =>
    this.getCategoryModal().find(this.repository.getModalEmptyTextSelector());

  getAltTextModalEmptyText = (): Cypress.Chainable =>
    this.getAltTextModal().find(this.repository.getModalEmptyTextSelector());

  getCategorySelect = (): Cypress.Chainable =>
    this.getCategoryModal().find(this.repository.getCategorySelectSelector());

  getCategorySelectOptions = (): Cypress.Chainable =>
    this.getCategoryModal().find(this.repository.getCategorySelectOptionSelector());

  getOuterCategorySelect = (): Cypress.Chainable => cy.get(this.repository.getOuterCategorySelectSelector());

  clickCategoryModalApply = (): Cypress.Chainable =>
    this.getCategoryModal().find(this.repository.getModalApplyButtonSelector()).click({ force: true });

  clickAltTextModalApply = (): Cypress.Chainable =>
    this.getAltTextModal().find(this.repository.getModalApplyButtonSelector()).click({ force: true });

  getFirstTriggeredAltTextField = (): Cypress.Chainable =>
    this.getAltImageTriggers().first().parent().find(this.repository.getImageRowAltTextFieldSelector()).first();

  getAltTextInput = (): Cypress.Chainable => this.getAltTextModal().find(this.repository.getAltTextInputSelector());

  getResponsePopover = (): Cypress.Chainable => cy.get(this.repository.getResponsePopoverSelector());

  getResponseField = (): Cypress.Chainable => cy.get(this.repository.getResponseFieldSelector());

  getResponseErrorBlock = (): Cypress.Chainable => cy.get(this.repository.getResponseErrorBlockSelector());

  getResponseAgainButton = (): Cypress.Chainable => cy.get(this.repository.getResponseAgainButtonSelector());

  getResponseApplyButton = (): Cypress.Chainable => cy.get(this.repository.getResponseApplyButtonSelector());

  getCategoryModalErrorHolder = (): Cypress.Chainable =>
    this.getCategoryModal().find(this.repository.getModalErrorHolderSelector());

  getAltTextModalErrorHolder = (): Cypress.Chainable =>
    this.getAltTextModal().find(this.repository.getModalErrorHolderSelector());

  getAltTriggerTemplate = (): Cypress.Chainable => cy.get(this.repository.getAltTriggerTemplateSelector());

  getContentImproverUrl = (): string => this.getBackofficeAbsoluteUrl(this.repository.getContentImproverPath());

  getCategorySuggestionUrl = (): string => this.getBackofficeAbsoluteUrl(this.repository.getCategorySuggestionPath());

  getImageAltTextUrl = (): string => this.getBackofficeAbsoluteUrl(this.repository.getImageAltTextPath());

  getTranslateUrl = (): string => this.getBackofficeAbsoluteUrl(this.repository.getTranslatePath());

  openAllActionsPopover = (): Cypress.Chainable => this.getRequestBuilderTriggers().first().click({ force: true });

  openLocaleSelectorPopover = (): Cypress.Chainable => this.getTranslateActionButton().click({ force: true });

  clickCategoryTrigger = (): Cypress.Chainable => this.getCategoryTrigger().click({ force: true });

  clickFirstAltImageTrigger = (): Cypress.Chainable => this.getAltImageTriggers().first().click({ force: true });

  clickImproveContent = (): Cypress.Chainable => this.getImproveContentButton().click({ force: true });

  clickFirstLocaleButton = (): Cypress.Chainable => this.getLocaleButtons().first().click({ force: true });

  clearInformationalFields = (): Cypress.Chainable =>
    cy.get(this.repository.getInformationalFieldSelector()).each(($field) => cy.wrap($field).invoke('val', ''));

  clearImageUrlFields = (): Cypress.Chainable =>
    cy.get(this.repository.getImageUrlFieldSelector()).each(($field) => cy.wrap($field).invoke('val', ''));

  closeAllActionsPopover = (): Cypress.Chainable =>
    this.getAllActionsPopover().find(this.repository.getClosePopoverButtonSelector()).first().click({ force: true });

  clickResponseAgain = (): Cypress.Chainable => this.getResponseAgainButton().click({ force: true });

  clickResponseApply = (): Cypress.Chainable => this.getResponseApplyButton().click({ force: true });

  clickLocaleButtonFor = (locale: string): Cypress.Chainable =>
    this.getLocaleButtons().filter(`[data-locale="${locale}"]`).first().click({ force: true });

  getFirstRequestBuilderLocale = (): Cypress.Chainable =>
    this.getRequestBuilderTriggers().first().invoke('attr', 'data-current-locale');

  getLocaleButtonFor = (locale: string): Cypress.Chainable =>
    this.getLocaleButtons().filter(`[data-locale="${locale}"]`);

  getFirstRequestBuilderTargetField = (): Cypress.Chainable =>
    this.getRequestBuilderTriggers()
      .first()
      .invoke('attr', 'data-target-field')
      .then((selector) => cy.get(selector as string).first());

  appendImageAltTextWrapper = (marker: string): Cypress.Chainable =>
    cy.document().then((document): void => {
      const wrapper = document.createElement('div');
      wrapper.className = `form-group ${this.repository.getImageAltTextWrapperSelector().replace('.', '')} ${marker}`;
      document.body.appendChild(wrapper);
    });

  getInjectedWrapper = (marker: string): Cypress.Chainable => cy.get(`.${marker}`);

  getInjectedAltTrigger = (marker: string): Cypress.Chainable =>
    this.getInjectedWrapper(marker).find(this.repository.getInjectedAltTriggerSelector());

  getAffixClass = (): string => this.repository.getAffixClass();

  getLoadingClass = (): string => this.repository.getLoadingClass();

  getEmptyClass = (): string => this.repository.getEmptyClass();

  getCategoryModalId = (): string => this.repository.getCategoryModalId();

  getContentImproverPath = (): string => this.repository.getContentImproverPath();

  getTranslatePath = (): string => this.repository.getTranslatePath();

  getImageAltTextPath = (): string => this.repository.getImageAltTextPath();

  getCategorySuggestionPath = (): string => this.repository.getCategorySuggestionPath();

  getProviderEndpointGlobs = (): Array<string> => this.repository.getProviderEndpointGlobs();

  getCategoryEmptyText = (): string => this.repository.getCategoryEmptyText();

  getAltTextEmptyText = (): string => this.repository.getAltTextEmptyText();

  getProviderUnavailableMessage = (): string => this.repository.getProviderUnavailableMessage();

  getMissingParamsMessage = (endpoint: 'content-improver' | 'image-alt-text' | 'translate'): string =>
    this.repository.getMissingParamsMessage(endpoint);

  shouldBeOpenPopover = (chainable: Cypress.Chainable): Cypress.Chainable =>
    chainable
      .should('be.visible')
      .and(($el) => expect($el[0].matches(this.repository.getOpenPopoverState())).to.eq(true));

  shouldBeClosedPopover = (chainable: Cypress.Chainable): Cypress.Chainable =>
    chainable.should(($el) => expect($el[0].matches(this.repository.getOpenPopoverState())).to.eq(false));
}
