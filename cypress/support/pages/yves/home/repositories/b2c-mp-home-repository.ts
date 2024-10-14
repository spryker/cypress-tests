import { injectable } from 'inversify';

import { HomeRepository } from '../home-repository';

@injectable()
export class B2cMpHomeRepository implements HomeRepository {
  getStoreSelect = (): Cypress.Chainable =>
    cy.get('[data-qa="component header"] [data-qa="component select _store"] [name="_store"]');
}
