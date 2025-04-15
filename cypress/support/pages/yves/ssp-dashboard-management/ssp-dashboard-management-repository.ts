export interface SspDashboardManagementRepository {
    getUserInfoBlock(): Cypress.Chainable;
    getUserInfoBlockWelcome(): Cypress.Chainable;
    getWelcomeBlock(): Cypress.Chainable;
    getOverviewBlock(): Cypress.Chainable;
    getOverviewTitle(): string;
    getStatsColumnBlocks(): Cypress.Chainable;
    getSalesRepresentativeBlocks(): Cypress.Chainable;
    getExpectedStatsColumnBlocks(): string[];
}
