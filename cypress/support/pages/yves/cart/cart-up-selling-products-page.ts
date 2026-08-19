import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { CartUpSellingProductsRepository } from './cart-up-selling-products-repository';

@injectable()
@autoWired
export class CartUpSellingProductsPage extends YvesPage {
  @inject(REPOSITORIES.CartUpSellingProductsRepository) private repository: CartUpSellingProductsRepository;

  protected PAGE_URL = '/cart';

  getUpSellingCarousel = (): Cypress.Chainable => this.repository.getUpSellingCarousel();

  getUpSellingProductItems = (): Cypress.Chainable => this.repository.getUpSellingProductItems();
}
