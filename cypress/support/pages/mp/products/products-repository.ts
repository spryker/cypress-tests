import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductsRepository {
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '.spy-table-search-feature input[type="text"]';
  getSaveButtonSelector = (): string => 'button:contains("Save")';
  getTaxIdSelector = (): string => 'select[name="productAbstract[idTaxSet]"]';
  getTaxIdOptionSelector = (): string => 'select[name="productAbstract[idTaxSet]"] > option';
  getDrawer = (): Cypress.Chainable => cy.get('.spy-drawer-wrapper');
  getAddAttributeButton = (): Cypress.Chainable => cy.get('.product-attributes-table button:contains("Add")');
  getAttributesTableSelector = (): string => '.product-attributes-table';
}
