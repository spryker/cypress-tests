import { autoWired } from '@utils';
import { injectable } from 'inversify';

/**
 * Selectors mirror Spryker\Zed\MailTemplate\Communication\Presentation\Manage\index.twig and the
 * Symfony form block prefix of MailTemplateOverrideForm (`mail_template_override_form`).
 * The chip contract (class + data attributes) is MailTemplateConfig::getChipTemplate().
 */
@injectable()
@autoWired
export class MailTemplateManageRepository {
  getFormSelector = (): string => 'form.js-mail-template-form';
  getForm = (): Cypress.Chainable => cy.get(this.getFormSelector());

  getHtmlBodyTextarea = (): Cypress.Chainable => cy.get('#mail_template_override_form_source');
  getTextBodyTextarea = (): Cypress.Chainable => cy.get('#mail_template_override_form_sourceText');
  getSubjectInput = (): Cypress.Chainable => cy.get('#mail_template_override_form_subject');
  getStoreNameSelect = (): Cypress.Chainable => cy.get('#mail_template_override_form_storeName');
  getLocaleNameSelect = (): Cypress.Chainable => cy.get('#mail_template_override_form_localeName');

  getTabLinkSelector = (tabId: string): string => `a[href="#${tabId}"]`;
  getTabLink = (tabId: string): Cypress.Chainable => cy.get(this.getTabLinkSelector(tabId));
  getTabPane = (tabId: string): Cypress.Chainable => cy.get(`#${tabId}`);

  getSaveButton = (): Cypress.Chainable => cy.get('button.js-mail-template-save');
  getSourcePanel = (): Cypress.Chainable => cy.get('.js-mail-template-source-panel');
  getPreviewFrame = (): Cypress.Chainable => cy.get('iframe.js-mail-template-preview-frame');

  // Summernote renders the MailTemplate toolbar button group from MailVariableEditor#createVariableButton.
  getEditorArea = (): Cypress.Chainable => cy.get('.note-editor .note-editable');
  getVariableDropdownToggle = (): Cypress.Chainable => cy.get('.note-editor .note-toolbar .dropdown-toggle');
  getVariableDropdownItems = (): Cypress.Chainable => cy.get('.note-editor .note-toolbar .dropdown-menu a');

  getChipSelector = (): string => 'span.js-mail-chip';
  getVariableChips = (): Cypress.Chainable =>
    cy.get(`.note-editor .note-editable ${this.getChipSelector()}[data-type="variable"]`);
}
