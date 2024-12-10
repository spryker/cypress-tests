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
    cy.url().should('include', `${locale}`);
  };

  assertCurrentLocale = (locale: string): Cypress.Chainable => {
    return cy.get('html').should('have.attr', this.yvesRepository.getLocaleAttributeName(), locale);
  };
}
