import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductOfferCreateRepository {
  getProductSearchField = (): Cypress.Chainable => cy.get('[data-qa="table-search"]');
  getMerchantSkuField = (): string => '#product_offer_form_merchant_sku';
  getStoreField = (): Cypress.Chainable => cy.get('[name="create_offer_form[stores][]"]');

  getStockQuantityField = (): Cypress.Chainable => cy.get('[name="create_offer_form[stockQuantity]"]');
  getServicePointField = (): Cypress.Chainable => cy.get('[name="create_offer_form[servicePoint]"]');
  getServiceField = (): Cypress.Chainable => cy.get('[name="create_offer_form[servicePointServices][]"]');
  getValidFromField = (): Cypress.Chainable => cy.get('[name="create_offer_form[validFrom]"]');
  getValidToField = (): Cypress.Chainable => cy.get('[name="create_offer_form[validTo]"]');
  getIsNeverOfStockCheckbox = (): Cypress.Chainable => cy.get('[name="create_offer_form[isNeverOutOfStock]"]');
  getShipmentTypesField = (): Cypress.Chainable => cy.get('[name="create_offer_form[shipmentTypes][]"]');

  getSaveButton = (): Cypress.Chainable => cy.get('[name="create_offer_form"]').find('button');

  getSuccessMessageBox = (): Cypress.Chainable => cy.get('.alert-success', { timeout: 10000 });

  getTableRowsSelector = (): string => 'table.dataTable tbody tr';

  getCreateOfferLinkSelector = (): string => 'a[href*="/self-service-portal/create-offer/form?id-product-concrete="]';
}
