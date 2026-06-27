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

  getAltTextInput = (): Cypress.Chainable => this.getAltTextModal().find(this.repository.getAltTextInputSelector());

  openAllActionsPopover = (): Cypress.Chainable => this.getRequestBuilderTriggers().first().click({ force: true });

  openLocaleSelectorPopover = (): Cypress.Chainable => this.getTranslateActionButton().click({ force: true });

  clickCategoryTrigger = (): Cypress.Chainable => this.getCategoryTrigger().click({ force: true });

  clickFirstAltImageTrigger = (): Cypress.Chainable => this.getAltImageTriggers().first().click({ force: true });

  clearInformationalFields = (): Cypress.Chainable =>
    cy.get(this.repository.getInformationalFieldSelector()).each(($field) => cy.wrap($field).invoke('val', ''));

  clearImageUrlFields = (): Cypress.Chainable =>
    cy.get(this.repository.getImageUrlFieldSelector()).each(($field) => cy.wrap($field).invoke('val', ''));

  shouldBeOpenPopover = (chainable: Cypress.Chainable): Cypress.Chainable =>
    chainable
      .should('be.visible')
      .and(($el) => expect($el[0].matches(this.repository.getOpenPopoverState())).to.eq(true));
}
