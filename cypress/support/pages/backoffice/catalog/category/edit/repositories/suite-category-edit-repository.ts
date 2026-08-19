import { injectable } from 'inversify';
import { CategoryEditRepository, CategoryFlag } from '../category-edit-repository';

@injectable()
export class SuiteCategoryEditRepository implements CategoryEditRepository {
  getHeading(): Cypress.Chainable {
    return cy.get('h2');
  }

  getKeyInput(): Cypress.Chainable {
    return cy.get('[name="category[category_key]"]');
  }

  getFlagCheckbox(flag: CategoryFlag): Cypress.Chainable {
    return cy.get(`[name="category[${flag}]"]`);
  }

  getSubmitButton(): Cypress.Chainable {
    return cy.get('button.btn-primary.safe-submit');
  }

  getHeadingText(): string {
    return 'Edit category';
  }

  getUpdateSuccessMessage(): string {
    return 'The category was updated successfully.';
  }
}
