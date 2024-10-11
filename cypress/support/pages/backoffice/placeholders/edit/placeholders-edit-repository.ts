import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class PlaceholdersEditRepository {
  getDeLocalizedTextarea = (): Cypress.Chainable =>
    cy.get('#cms_glossary_glossaryAttributes_0_translations_0_translation + .note-editor .note-editable');

  getEnLocalizedTextarea = (): Cypress.Chainable =>
    cy.get('#cms_glossary_glossaryAttributes_0_translations_1_translation + .note-editor .note-editable');

  getCollapsedIbox = (): Cypress.Chainable =>
    cy.get('#tab-content-title .placeholder-translation-container > .collapsed > .ibox-title .collapse-link', {
      timeout: 15000,
    });

  getUpdatePlaceholderButton = (): Cypress.Chainable => cy.get('form[name=cms_glossary]').find('[type="submit"]');

  getPublishPageButton = (): Cypress.Chainable => cy.get('[name="publish_version_page_form"]').find('.safe-submit');
}