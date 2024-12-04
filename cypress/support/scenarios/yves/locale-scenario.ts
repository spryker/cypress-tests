import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class LocaleScenario {
  getAvailableLocales = (): Cypress.Chainable => {
    return cy.get('[data-qa="language-selector"] option').then((options) => {
      const values = Array.from(options).map((option) => option.textContent?.trim() || '');
      return Cypress.Promise.resolve(values);
    });
  };

  switchLocale = (locale: string): void => {
    cy.get('[data-qa="language-selector"]').last().select(locale).should('contain.text', locale);
  };

  getCurrentLocale = (locale: string): Cypress.Chainable => {
    return cy.get('html').should('have.attr', 'data-locale', locale);
  };
}
