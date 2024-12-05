import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CmsPlaceholderEditRepository {
  getTitleBlock = (): Cypress.Chainable => cy.get('#tab-content-title');
  getAllIboxesSelector = (): string => '.placeholder-translation-container > .ibox.nested';
  getAllCollapsedIboxButtonsSelector = (): string => '.placeholder-translation-container >  .collapsed .collapse-link';
  getLocalizedTextareaSelector = (): string => '.note-editor .note-editable';
  getPublishPageButton = (): Cypress.Chainable => cy.get('[name="publish_version_page_form"]').find('.safe-submit');
  getUpdatePlaceholderButton = (): Cypress.Chainable => cy.get('form[name=cms_glossary]').find('[type="submit"]');
}
