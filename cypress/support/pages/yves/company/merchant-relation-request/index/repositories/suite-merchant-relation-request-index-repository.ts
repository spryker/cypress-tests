import { injectable } from 'inversify';
import { MerchantRelationRequestIndexRepository } from '../merchant-relation-request-index-repository';

@injectable()
export class SuiteMerchantRelationRequestIndexRepository implements MerchantRelationRequestIndexRepository {
  getMerchantRelationRequestButton = (): Cypress.Chainable =>
    cy.get('[data-qa="create-merchant-relation-request-button"]');
}
