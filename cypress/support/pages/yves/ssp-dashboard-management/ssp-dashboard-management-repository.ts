export interface SspDashboardManagementRepository {
    getUserInfoBlock(): Cypress.Chainable;
    getUserInfoBlockWelcome(): Cypress.Chainable;
    getOverview(): Cypress.Chainable;
    getOverviewTitle(): string;
}
