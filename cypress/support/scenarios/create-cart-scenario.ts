import { Page as MultiCartPage } from '../pages/yves/multi-cart/page';
import { inject, injectable } from 'inversify';
import { autoProvide } from '../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class CreateCartScenario {
  constructor(@inject(MultiCartPage) private multiCartPage: MultiCartPage) {}

  execute = (): void => {
    this.multiCartPage.createCart();
  };
}
