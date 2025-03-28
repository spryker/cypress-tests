// Import Cypress types
type Chainable<Subject = JQuery<HTMLElement>> = Cypress.Chainable<Subject>;
type JQueryElement = JQuery<HTMLElement>;

export interface SspServiceRepository {
  getSspServiceTable(): Chainable<JQueryElement>;

  getSspServiceTableRows(): Chainable<JQueryElement>;

  getSspServiceTableHeaders(): Chainable<JQueryElement>;

  getSortingTriggers(): Chainable<JQueryElement>;

  getSortOrderByInput(): Chainable<JQueryElement>;

  getSortDirectionInput(): Chainable<JQueryElement>;

  getResetButton(): Chainable<JQueryElement>;

  getPagination(): Chainable<JQueryElement>;

  getSortColumnByName(columnName: string): Chainable<JQueryElement>;

  // Search form methods
  getSearchTypeSelect(): Chainable<JQueryElement>;

  getSearchTextInput(): Chainable<JQueryElement>;

  getBusinessUnitSelect(): Chainable<JQueryElement>;

  getSearchButton(): Chainable<JQueryElement>;

  getFirstRowReference(): string;

  getFirstRowViewDetailsButton(): Chainable<JQueryElement>;
}
