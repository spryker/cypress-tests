import { injectable } from 'inversify';

import { HomeRepository } from '../home-repository';

@injectable()
export class B2bMpHomeRepository implements HomeRepository {
    selectStore = (storeName: string): Cypress.Chainable =>
    cy.get('[data-qa="component header"] [data-qa="component custom-select _store"] [name="_store"]').select(storeName, { force: true });
  getStoreSelectorOption = (storeName: string): string => `select[name="_store"] option[value*="${storeName}"]`;
  getStoreSelectorHeader = (): string => `header [data-qa="component custom-select _store"]`;
}
