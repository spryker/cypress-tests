export interface SspDashboardManagementRepository {
    getUserInfoBlock(): Cypress.Chainable;
    getUserInfoBlockWelcome(): Cypress.Chainable;
    getWelcomeBlock(): Cypress.Chainable;
    getOverviewBlock(): Cypress.Chainable;
    getOverviewTitle(): string;
    getStatsColumnBlocks(): Cypress.Chainable;
    getStatsColumnTitleName(): string;
    getStatsColumnCounterName(): string;
    getSalesRepresentativeBlocks(): Cypress.Chainable;
    getAssetsBlock(): Cypress.Chainable;
    getAssetPreviewBlock(): Cypress.Chainable;
    getAssetPreviewItemBlock(index: number): Cypress.Chainable;
    getAssetPreviewItemLinkBlock(index: number): Cypress.Chainable;
    getExpectedStatsColumnBlocks(): string[];
    getPlaceholderImage(): string;
}
