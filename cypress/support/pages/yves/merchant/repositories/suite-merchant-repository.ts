import { injectable } from 'inversify';
import { MerchantRepository } from '../merchant-repository';

@injectable()
export class SuiteMerchantRepository implements MerchantRepository {
  getMerchantRelationRequestButton = (): Cypress.Chainable =>
    cy.get('[data-qa="merchant-relation-request-create-button"]');
}
