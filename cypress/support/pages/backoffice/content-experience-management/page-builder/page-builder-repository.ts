import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class PageBuilderRepository {
  getRoot = (): Cypress.Chainable => cy.get('[data-qa="page-builder"]');

  getStatus = (): Cypress.Chainable => cy.get('[data-qa="page-builder-header"] [data-qa="content-status"]');

  getStatusLine = (): Cypress.Chainable => cy.get('[data-qa="page-builder-status-line"]');

  getErrors = (): Cypress.Chainable => cy.get('[data-qa="page-builder-errors"]');

  getPlaceholder = (placeholder: string): Cypress.Chainable =>
    cy.get(`[data-qa="page-builder-placeholder"][data-placeholder="${placeholder}"]`);

  getAddTextButtonSelector = (): string => '[data-qa="page-builder-add-text"]';

  getRichTextSelector = (): string => '[data-qa="page-builder-rich-text"] .ProseMirror';

  getSectionSelector = (): string => '[data-qa="page-builder-section"]';

  getSlot = (slotName: string): Cypress.Chainable => cy.contains('[data-qa="page-builder-slot"]', slotName);

  getSlotBlockSelector = (): string => '[data-qa="page-builder-slot-block"]';

  getLibrarySearchInput = (): Cypress.Chainable => cy.get('[data-qa="page-builder-library-search"]');

  getLibraryTypeSelect = (): Cypress.Chainable => cy.get('[data-qa="page-builder-library-type"]');

  getLibraryCard = (text: string): Cypress.Chainable => cy.contains('[data-qa="page-builder-library-card"]', text);

  getLibraryTargetSelectSelector = (): string => '[data-qa="page-builder-library-target"]';

  getLibraryAddButtonSelector = (): string => '[data-qa="page-builder-library-add"]';

  getLocaleSelect = (): Cypress.Chainable => cy.get('[data-qa="page-builder-locale"]');

  getCopyLocaleButtonSelector = (): string => '[data-qa="page-builder-copy-locale"]';

  getSaveButton = (): Cypress.Chainable => cy.get('[data-qa="page-builder-save"]');

  getPublishButton = (): Cypress.Chainable => cy.get('[data-qa="page-builder-publish"]');

  getCreateBannerButton = (): Cypress.Chainable => cy.get('[data-qa="page-builder-create-banner"]');

  getBannerInput = (field: string): Cypress.Chainable => cy.get(`[data-qa="page-builder-banner-${field}"]`);

  getBannerFieldError = (field: string): Cypress.Chainable => cy.get(`#page-builder-banner-${field}-error`);

  getBannerSubmitButton = (): Cypress.Chainable => cy.get('[data-qa="page-builder-banner-submit"]');

  getBannerModal = (): Cypress.Chainable => cy.get('[data-qa="page-builder-banner-modal"]');
}
