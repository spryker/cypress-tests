export interface ClaimRepository {
    getCreateGeneralClaimButton(): Cypress.Chainable;
    getCreateOrderClaimButton(): Cypress.Chainable;
    getClaimCreatedMessage(): string;
}
