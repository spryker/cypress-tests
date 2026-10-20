import { injectable } from 'inversify';
import { CartUpSellingProductsRepository } from '../cart-up-selling-products-repository';

@injectable()
export class B2bCartUpSellingProductsRepository implements CartUpSellingProductsRepository {
  // The demoshops override the similar-products template to use the slick carousel; suite renders the
  // simple carousel.
  getUpSellingCarousel(): Cypress.Chainable {
    return cy.get('.slick-carousel__container');
  }

  getUpSellingProductItems(): Cypress.Chainable {
    return cy.get('.slick-carousel__container [data-qa="component product-item"]');
  }
}
