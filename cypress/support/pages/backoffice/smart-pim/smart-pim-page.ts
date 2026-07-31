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
}
