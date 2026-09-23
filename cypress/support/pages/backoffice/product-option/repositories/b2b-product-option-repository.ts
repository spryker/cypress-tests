import { injectable } from 'inversify';
import { ProductOptionRepository } from '../product-option-repository';

@injectable()
export class B2bProductOptionRepository implements ProductOptionRepository {
  // Every locale renders its own translation block; `localized-ibox` collapses all but the first
  // (`collapsed: not loop.first`), so the collapsed block is the non-default locale and its
  // `.collapse-link` is the toggle — no positional nth-child chain needed.
  private COLLAPSED_TRANSLATION_BLOCK_TOGGLE =
    '#option-value-translations [data-locale-code] .ibox.collapsed .ibox-title a.collapse-link';

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

  getCollapsedTranslationBlockToggle(): Cypress.Chainable {
    return cy.get(this.COLLAPSED_TRANSLATION_BLOCK_TOGGLE).first();
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
    return cy.get(`#product-table tbody tr:nth-child(${rowNumber}) td:first-child`);
  }

  getAllProductsCheckbox(idProduct: string): Cypress.Chainable {
    return cy.get(`#all_products_checkbox_${idProduct}`);
  }

  getProductsToBeAssignedTab(): Cypress.Chainable {
    return cy.get('#products-to-be-assigned');
  }

  // The "Products to be assigned" table is built client-side with a fixed ID/SKU/Name/Selected
  // column order, so the first cell of the first row is the id of the product just selected.
  getSelectedProductRowCell(): Cypress.Chainable {
    return cy.get('#selectedProductsTable tbody tr:first-child td:first-child');
  }

  getUnassignProductLink(idProduct: string): Cypress.Chainable {
    return cy.get(`a[data-id="${idProduct}"]`);
  }

  getCreateBreadcrumb(): string {
    return 'Create new Product Option';
  }

  getProductCreatedSuccessMessage(): string {
    return 'Product option group created.';
  }
}
