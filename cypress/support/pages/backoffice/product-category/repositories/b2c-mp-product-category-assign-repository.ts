import { injectable } from 'inversify';
import { ProductCategoryAssignRepository } from '../product-category-assign-repository';

@injectable()
export class B2cMpProductCategoryAssignRepository implements ProductCategoryAssignRepository {
  getAvailableProductsSearchInput(): Cypress.Chainable {
    return cy.get('input[aria-controls="product-table"]', { timeout: 15000 });
  }

  getAvailableProductCheckbox(idProductAbstract: number): Cypress.Chainable {
    return cy.get(`#all_products_checkbox_${idProductAbstract}`, { timeout: 20000 });
  }

  getAssignedProductCheckbox(idProductAbstract: number): Cypress.Chainable {
    return cy.get(`#product_category_checkbox_${idProductAbstract}`, { timeout: 20000 });
  }

  getProductsToBeAssignedField(): Cypress.Chainable {
    return cy.get('#assign_form_products_to_be_assigned');
  }

  getProductsToBeDeassignedField(): Cypress.Chainable {
    return cy.get('#assign_form_products_to_be_de_assigned');
  }

  getSubmitButton(): Cypress.Chainable {
    return cy.get('form[name="assign_form"] input[type="submit"]');
  }

  getSuccessAlert(): Cypress.Chainable {
    return cy.get('.alert-success', { timeout: 20000 });
  }
}
