import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ProductCategoryAssignRepository } from './product-category-assign-repository';

@injectable()
@autoWired
export class ProductCategoryAssignPage extends BackofficePage {
  @inject(REPOSITORIES.ProductCategoryAssignRepository) private repository: ProductCategoryAssignRepository;

  visitAssignPage = (idCategory: number): void => {
    cy.visitBackoffice(`/product-category/assign?id-category=${idCategory}`);
  };

  assignProduct = (params: AssignProductParams): void => {
    // The available-products table is a server-side DataTables grid listing the whole catalogue,
    // so the target row is not on the first page — filter it in by the abstract SKU first.
    this.repository.getAvailableProductsSearchInput().clear().type(params.searchTerm);

    // No fixed wait: cy.get retries the DOM query until the DataTables ajax renders the row.
    this.repository.getAvailableProductCheckbox(params.idProductAbstract).check({ force: true });

    this.repository.getProductsToBeAssignedField().should('have.attr', 'value', `${params.idProductAbstract}`);

    this.repository.getSubmitButton().click();
  };

  deassignProduct = (params: DeassignProductParams): void => {
    // A freshly-seeded category holds a single assigned product, so it lands on the first page of the
    // assigned-products table — retry the DOM query while the server-side ajax settles (no fixed wait).
    this.repository.getAssignedProductCheckbox(params.idProductAbstract).uncheck({ force: true });

    this.repository.getProductsToBeDeassignedField().should('have.attr', 'value', `${params.idProductAbstract}`);

    this.repository.getSubmitButton().click();
  };

  getSuccessAlert = (): Cypress.Chainable => this.repository.getSuccessAlert();

  // A successful save moves the product between the available- and assigned-products tables, so the
  // caller asserts on this checkbox existing (assign) or being gone (deassign).
  getAssignedProductCheckbox = (idProductAbstract: number): Cypress.Chainable =>
    this.repository.getAssignedProductCheckbox(idProductAbstract);
}

interface AssignProductParams {
  idProductAbstract: number;
  searchTerm: string;
}

interface DeassignProductParams {
  idProductAbstract: number;
}
