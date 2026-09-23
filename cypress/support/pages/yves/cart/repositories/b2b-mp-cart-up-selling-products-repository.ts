import { injectable } from 'inversify';
import { CartUpSellingProductsRepository } from '../cart-up-selling-products-repository';

@injectable()
export class B2bMpCartUpSellingProductsRepository implements CartUpSellingProductsRepository {
  // Both B2B shops override the similar-products template to use the slick carousel; the simple
  // carousel is what the other storefronts render.
  getUpSellingCarousel(): Cypress.Chainable {
    return cy.get('.slick-carousel__container');
  }

  getUpSellingProductItems(): Cypress.Chainable {
    return cy.get('.slick-carousel__container [data-qa="component product-item"]');
  }
}
