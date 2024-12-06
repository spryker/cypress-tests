import { injectable } from 'inversify';

import { YvesRepository } from '../yves-repository';

@injectable()
export class B2bYvesRepository implements YvesRepository {
  selectLocale = (localeName: string): Cypress.Chainable =>
    cy.get('[data-qa="component header"] [data-qa="language-selector"]').select(localeName, { force: true });
  getLocaleOptionsSelector = (): string => `[data-qa="language-selector"] option`;
  getLocaleAttributeName = (): string => 'data-locale';
}
