import { injectable } from 'inversify';
import { MerchantRepository } from '../merchant-repository';

@injectable()
export class B2cMerchantRepository implements MerchantRepository {
  getMerchantRelationRequestButton = (): Cypress.Chainable =>
    cy.get('[data-qa="merchant-relation-request-create-button"]');
  getInformationItemLabelSelector = (): string => '[data-qa="component information-item"] strong';
}
