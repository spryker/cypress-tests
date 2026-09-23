import { injectable } from 'inversify';
import { CartUpSellingProductsRepository } from '../cart-up-selling-products-repository';

@injectable()
export class SuiteCartUpSellingProductsRepository implements CartUpSellingProductsRepository {
  getUpSellingCarousel(): Cypress.Chainable {
    return cy.get('.simple-carousel__container');
  }

  getUpSellingProductItems(): Cypress.Chainable {
    return cy.get('.simple-carousel__container [data-qa="component product-item"]');
  }
}
