import { injectable } from 'inversify';
import { CartUpSellingProductsRepository } from '../cart-up-selling-products-repository';

@injectable()
export class B2cCartUpSellingProductsRepository implements CartUpSellingProductsRepository {
  getUpSellingCarousel(): Cypress.Chainable {
    return cy.get('.slick-carousel__container');
  }

  getUpSellingProductItems(): Cypress.Chainable {
    return cy.get('.slick-carousel__container [data-qa="component product-item"]');
  }
}
