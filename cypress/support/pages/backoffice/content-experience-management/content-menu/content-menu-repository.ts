export interface ContentMenuRepository {
  getContentMenuHomeLink(): Cypress.Chainable;
  getContentMenuEntrySelector(): string;
  getContentMenuSubmenuSelector(): string;
  getMenuLinkByUrl(url: string): Cypress.Chainable;
  getDataTable(): Cypress.Chainable;
}
