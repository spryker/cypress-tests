import { injectable } from 'inversify';

import { HomeRepository } from '../home-repository';

@injectable()
export class SuiteHomeRepository implements HomeRepository {
    selectStore = (storeName: string): Cypress.Chainable =>
    cy.get('[data-qa="component header"] [data-qa="component select _store"] [name="_store"]').select('Store: ' + storeName, { force: true });
    getStoreSelectorOption = (storeName: string): string => `select[name="_store"] option[value*="${storeName}"]`;
  getStoreSelectorHeader = (): string => `header [data-qa="component select _store"]`;
}
