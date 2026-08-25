export type CategoryFlag = 'is_active' | 'is_in_menu' | 'is_searchable';

export interface CategoryEditRepository {
  getHeading(): Cypress.Chainable;
  getKeyInput(): Cypress.Chainable;
  getFlagCheckbox(flag: CategoryFlag): Cypress.Chainable;
  getSubmitButton(): Cypress.Chainable;
  getHeadingText(): string;
  getUpdateSuccessMessage(): string;
}
