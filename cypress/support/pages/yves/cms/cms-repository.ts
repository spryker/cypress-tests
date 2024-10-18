export interface CmsRepository {
    getFeaturedProductsBlockTitle(): string;
    getProductSelector(): Cypress.Chainable;
}
