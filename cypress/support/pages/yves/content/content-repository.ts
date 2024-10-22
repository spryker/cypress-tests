export interface ContentRepository {
    getSearchInput(): Cypress.Chainable;
    getFirstSuggestedCmsPage(cmsPageName: string): Cypress.Chainable;
}
