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

  /**
   * Get the reschedule button on the service details page
   */
  getDetailsPageRescheduleButton(): Chainable<JQueryElement>;

  /**
   * Get the reschedule form date input field
   */
  getRescheduleFormDateInput(): Chainable<JQueryElement>;

  /**
   * Get the reschedule form time input field
   */
  getRescheduleFormTimeInput(): Chainable<JQueryElement>;

  /**
   * Get the reschedule form submit button
   */
  getRescheduleFormSubmitButton(): Chainable<JQueryElement>;

  /**
   * Get the cancel button on the service details page
   */
  getServiceCancelButton(): Chainable<JQueryElement>;

  getSspServicePageTitle(): Cypress.Chainable;

  getFiltersTriggerSelector(): Cypress.Chainable;
}
