// Import Cypress types
type Chainable<Subject = any> = Cypress.Chainable<Subject>;
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

  getSortColumnByName(columnName: string): Chainable<any>;
  
  // Search form methods
  getSearchTypeSelect(): Chainable<JQueryElement>;
  
  getSearchTextInput(): Chainable<JQueryElement>;

  getBusinessUnitSelect(): Chainable<JQueryElement>;
  
  getSearchButton(): Chainable<any>;

  getFirstRowReference(): string;

  getFirstRowViewDetailsButton(): Chainable<any>;
}
