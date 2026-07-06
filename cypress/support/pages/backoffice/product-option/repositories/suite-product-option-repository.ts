import { injectable } from 'inversify';
import { ProductOptionRepository } from '../product-option-repository';

@injectable()
export class SuiteProductOptionRepository implements ProductOptionRepository {
  getGroupNameInput(): Cypress.Chainable {
    return cy.get('#product_option_general_name');
  }

  getTaxSetSelect(): Cypress.Chainable {
    return cy.get('#product_option_general_fkTaxSet');
  }

  getGroupNameTranslationInput(index: number): Cypress.Chainable {
    return cy.get(`#product_option_general_groupNameTranslations_${index}_name`);
  }

  getTranslationCopyButton(): Cypress.Chainable {
    return cy.get('#product_option_general_groupNameTranslations_0 button');
  }

  getExpandSecondTranslationBlockLink(): Cypress.Chainable {
    return cy.get('#option-value-translations > div:nth-child(2) > div > div:nth-child(1) > a');
  }

  getOptionValueInput(elementNr: number): Cypress.Chainable {
    return cy.get(`#product_option_general_productOptionValues_${elementNr}_value`);
  }

  getOptionValueSkuInput(elementNr: number): Cypress.Chainable {
    return cy.get(`#product_option_general_productOptionValues_${elementNr}_sku`);
  }

  getOptionValueNetAmountInput(elementNr: number, currencyIndex: number): Cypress.Chainable {
    return cy.get(`#product_option_general_productOptionValues_${elementNr}_prices_${currencyIndex}_net_amount`);
  }

  getOptionValueGrossAmountInput(elementNr: number, currencyIndex: number): Cypress.Chainable {
    return cy.get(`#product_option_general_productOptionValues_${elementNr}_prices_${currencyIndex}_gross_amount`);
  }

  getAddAnotherOptionButton(): Cypress.Chainable {
    return cy.get('#add-another-option');
  }

  getOptionValueTranslationInput(index: number): Cypress.Chainable {
    return cy.get(`#product_option_general_productOptionValueTranslations_${index}_name`);
  }

  getSubmitButton(): Cypress.Chainable {
    return cy.get('#create-product-option-button');
  }

  getTopbar(): Cypress.Chainable {
    return cy.get('.app-topbar');
  }

  getProductTab(): Cypress.Chainable {
    return cy.get('[data-qa="tab-products"]');
  }

  getDataTableProcessing(): Cypress.Chainable {
    return cy.get('.dt-processing');
  }

  getProductTableRowCell(rowNumber: number): Cypress.Chainable {
    return cy.get(`#product-table tbody tr:nth-child(${rowNumber}) td:nth-child(1)`);
  }

  getAllProductsCheckbox(idProduct: string): Cypress.Chainable {
    return cy.get(`#all_products_checkbox_${idProduct}`);
  }

  getProductsToBeAssignedTab(): Cypress.Chainable {
    return cy.get('#products-to-be-assigned');
  }

  getSelectedProductRowCell(): Cypress.Chainable {
    return cy.get('#selectedProductsTable tbody tr:nth-child(1) td:nth-child(1)');
  }

  getUnassignProductLink(idProduct: string): Cypress.Chainable {
    return cy.get(`a[data-id="${idProduct}"]`);
  }

  getAssignedProductsListItem(): Cypress.Chainable {
    return cy.get('#page-wrapper > div:nth-child(3) > div:nth-child(2) > ul > li:nth-child(2)');
  }

  getAssignedTab(): Cypress.Chainable {
    return cy.get('#assigned');
  }

  getProductOptionTableRowCells(): Cypress.Chainable {
    return cy.get('#product-option-table tbody tr td:nth-child(1)');
  }

  getActivateButton(): Cypress.Chainable {
    return cy.get('#page-wrapper > div:nth-child(2) > div:nth-child(2) > div > form > button');
  }

  getActivateSuccessContainer(): Cypress.Chainable {
    return cy.get('#page-wrapper > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div');
  }

  getCreateBreadcrumb(): string {
    return 'Create new Product Option';
  }

  getEditBreadcrumb(): string {
    return 'Edit Product Option';
  }

  getProductCreatedSuccessMessage(): string {
    return 'Product option group created.';
  }

  getGroupModifiedSuccessMessage(): string {
    return 'Product option group modified.';
  }

  getOptionActivatedSuccessMessage(): string {
    return 'Option successfully activated.';
  }
}
