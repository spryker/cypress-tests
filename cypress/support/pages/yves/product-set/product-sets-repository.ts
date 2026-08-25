import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductSetsRepository {
  getProductSetCardSelector = (): string => 'article';
  getProductSetDetails = (): Cypress.Chainable => cy.get('[data-qa="component product-set-details"]');
  getProductSetProductItems = (): Cypress.Chainable => cy.get('[data-qa="component product-item"]');
  getProductSetDetailsSelector = (): string => '[data-qa="component product-set-details"]';
  getAddAllToCartButton = (): Cypress.Chainable => cy.get('form[name="addItemsForm"] button');
  getVariantSelect = (productName: string): Cypress.Chainable =>
    cy.contains('[data-qa="component product-item"]', productName).find('select');
}
