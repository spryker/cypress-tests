import { injectable } from 'inversify';
import { MerchantRelationRequestDetailsRepository } from '../merchant-relation-request-details-repository';

@injectable()
export class B2cMerchantRelationRequestDetailsRepository implements MerchantRelationRequestDetailsRepository {
  getCancelButton = (): Cypress.Chainable => cy.get('[data-qa="merchant-relation-request-cancel-button"]');
}
