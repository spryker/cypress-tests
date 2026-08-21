import { REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';

import { AbstractPage } from '../abstract-page';
import VisitOptions = Cypress.VisitOptions;
import { YvesRepository } from './yves-repository';

@injectable()
export class YvesPage extends AbstractPage {
  @inject(REPOSITORIES.YvesRepository) private yvesRepository: YvesRepository;

  visit = (options?: Partial<VisitOptions>): void => {
    cy.visit(this.PAGE_URL, options);
  };

  getAvailableLocales = (): Cypress.Chainable => {
    return cy.get(this.yvesRepository.getLocaleOptionsSelector()).then((options) => {
      const values = Array.from(options).map((option) => option.textContent?.trim() || '');
      return Cypress.Promise.resolve(values);
    });
  };

  selectLocale = (locale: string): void => {
    this.yvesRepository.selectLocale(locale);
    // eslint-disable-next-line spryker-cypress/no-assertions-in-page-objects -- Post-action guard confirming the locale switch took effect.
    cy.url().should('include', `${locale}`);
  };

  assertCurrentLocale = (locale: string): Cypress.Chainable => {
    // eslint-disable-next-line spryker-cypress/no-assertions-in-page-objects -- Returns the locale-attribute assertion for the caller to consume.
    return cy.get('html').last().should('have.attr', this.yvesRepository.getLocaleAttributeName(), locale);
  };

  clearLastVisitedPageCookie = (): void => {
    const cookieName = this.yvesRepository.getLastVisitedPageCookieName();

    if (cookieName) {
      cy.clearCookie(cookieName);
    }
  };

  clearSessionCookie = (): void => {
    cy.clearCookie(Cypress.env('yvesSessionCookieName'));
  };
}
