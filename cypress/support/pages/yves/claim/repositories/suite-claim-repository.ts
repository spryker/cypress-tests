import { injectable } from 'inversify';
import { ClaimRepository } from '../claim-repository';

@injectable()
export class SuiteClaimRepository implements ClaimRepository {
    getCreateGeneralClaimButton(): Cypress.Chainable {
        return cy.get('a[data-qa="create-general-claim"]');
    }

    getCancelClaimButton(): Cypress.Chainable {
        return cy.get('button[data-qa="cancel-claim"]');
    }

    getPendingClaimStatusSelector(): string {
        return '.claim-status-canceled';
    }

    getClaimCreatedMessage(): string
    {
        return 'Claim has been submitted successfully';
    }

    getClaimDetailLinks(): Cypress.Chainable {
        return cy.get('a[data-qa="claim-details"]');
    }
}
