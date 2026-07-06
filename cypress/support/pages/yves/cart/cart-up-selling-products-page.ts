import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { CartUpSellingProductsRepository } from './cart-up-selling-products-repository';

@injectable()
@autoWired
export class CartUpSellingProductsPage extends YvesPage {
  @inject(REPOSITORIES.CartUpSellingProductsRepository) private repository: CartUpSellingProductsRepository;

  protected PAGE_URL = '/cart';

  assertUpSellingCarouselVisible = (): void => {
    this.repository.getUpSellingCarousel().should('be.visible');
  };

  assertUpSellingProductRendered = (): void => {
    this.repository.getUpSellingProductItems().should('have.length.at.least', 1);
  };
}
