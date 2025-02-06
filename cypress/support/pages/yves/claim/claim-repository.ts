export interface ClaimRepository {
    getCreateGeneralClaimButton(): Cypress.Chainable;
    getCancelClaimButton(): Cypress.Chainable;
    getClaimCreatedMessage(): string;
    getClaimDetailLinks(): Cypress.Chainable;
}
