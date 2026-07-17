import { injectable } from 'inversify';
import { CategoryCreateRepository } from '../category-create-repository';

@injectable()
export class B2cMpCategoryCreateRepository implements CategoryCreateRepository {
  getKeyInput(): Cypress.Chainable {
    return cy.get('[name="category[category_key]"]');
  }

  getParentNodeSelect(): Cypress.Chainable {
    return cy.get('[name="category[parent_category_node]"]');
  }

  getTemplateSelect(): Cypress.Chainable {
    return cy.get('[name="category[fk_category_template]"]');
  }

  getCollapsedLocalizedAttributeToggle(): Cypress.Chainable {
    return cy.get('#localizedAttributes-ibox-de_DE .ibox-tools');
  }

  getFieldByName(name: string): Cypress.Chainable {
    return cy.get(`[name="${name}"]`);
  }

  getSubmitButton(): Cypress.Chainable {
    return cy.get('button.btn-primary.safe-submit');
  }

  getBreadcrumb(): Cypress.Chainable {
    return cy.get('.breadcrumb');
  }

  getSuccessMessage(): string {
    return 'The category was added successfully.';
  }
}
