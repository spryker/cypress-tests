import { injectable } from 'inversify';

import { HomeRepository } from '../home-repository';

@injectable()
export class B2cMpHomeRepository implements HomeRepository {
  selectStore = (storeName: string): Cypress.Chainable =>
    cy
      .get('[data-qa="component header"] [data-qa="component custom-select _store"] [name="_store"]')
      .select(storeName, { force: true });
  getStoreSelectorOption = (storeName: string): string => `select[name="_store"] option[value*="${storeName}"]`;
  getStoreSelectorHeader = (): string => `header [data-qa="component custom-select _store"]`;
  getNavigationNewLink = (newPageLinkText: string): Cypress.Chainable => {
    return cy
      .get('[data-qa="component navigation-multilevel-node"] a')
      .filter((_, el) => el.textContent?.trim() === newPageLinkText)
      .first();
  };
  getLanguageSwitcher = (): Cypress.Chainable => {
    return cy.get('[data-qa="component language-switcher"]');
  };
}
