import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class GlossaryFormRepository {
  getGlossaryKeyInput = (): Cypress.Chainable => cy.get('#translation_glossary_key');

  // One textarea per locale the store has, so the locales are never named here.
  getLocaleTextareas = (): Cypress.Chainable => cy.get('textarea[id^="translation_locales_"]');

  getSaveButton = (): Cypress.Chainable => cy.get('input.safe-submit');
}
