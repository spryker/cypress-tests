import { injectable } from 'inversify';
import { ClaimRepository } from '../claim-repository';

@injectable()
export class SuiteClaimRepository implements ClaimRepository {
    getCreateGeneralClaimButton(): Cypress.Chainable {
        return cy.get('a[data-qa="create-general-claim"]');
    }

    getCreateOrderClaimButton(): Cypress.Chainable {
        return cy.get('a[data-qa="create-order-claim"]');
    }

    getClaimCreatedMessage(): string
    {
        return 'Claim has been submitted successfully';
    }
}
