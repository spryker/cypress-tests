import { inject, injectable } from 'inversify';
import { autoProvide } from '../../utils/inversify/auto-provide';
import { YvesMultiCartPage } from '../../pages/yves/multi-cart/yves-multi-cart-page';

@injectable()
@autoProvide
export class CreateCartScenario {
  constructor(@inject(YvesMultiCartPage) private multiCartPage: YvesMultiCartPage) {}

  execute = (): void => {
    this.multiCartPage.createCart();
  };
}
