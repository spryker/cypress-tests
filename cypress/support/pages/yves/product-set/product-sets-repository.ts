import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductSetsRepository {
  getProductSetCardSelector = (): string => 'article';
  getProductSetCardLinkSelector = (): string => 'a';
  getProductSetDetails = (): Cypress.Chainable => cy.get('[data-qa="component product-set-details"]');
  getProductSetDetailsSelector = (): string => '[data-qa="component product-set-details"]';
  getProductSetProductItems = (): Cypress.Chainable => cy.get('[data-qa="component product-item"]');
  getAddAllToCartButton = (): Cypress.Chainable => cy.get('form[name="addItemsForm"] button');
  // One select per super attribute of the product, all of them named attributes[<abstract>][<key>].
  getVariantSelect = (productName: string, attributeKey: string): Cypress.Chainable =>
    cy.contains('[data-qa="component product-item"]', productName).find(`select[name$="[${attributeKey}]"]`);
}
