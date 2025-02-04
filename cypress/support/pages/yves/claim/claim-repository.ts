export interface ClaimRepository {
    getCreateGeneralClaimButton(): Cypress.Chainable;
    getClaimCreatedMessage(): string;
}
