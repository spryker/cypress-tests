export interface ProductComparisonRepository {
  getDeleteFromComparisonButton(sku: string): Cypress.Chainable;
  getClearComparisonListButton(): Cypress.Chainable;
  getComparisonPageNavigationLinkSelector(): string;
  getProductItemSelector(): string;
  getProductComparisonListIsEmptyMessage(): string;
  getComparisonTableRowSelector(): string;
}