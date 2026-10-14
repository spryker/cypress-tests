export interface ContentRepository {
  search(query: string): void;
  getFirstSuggestedCmsPage(cmsPageName: string): Cypress.Chainable;
}
