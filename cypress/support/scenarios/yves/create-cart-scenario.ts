import { inject, injectable } from 'inversify';
import { YvesMultiCartPage } from '../../pages/yves/multi-cart/yves-multi-cart-page';
import { autoWired } from '../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class CreateCartScenario {
  constructor(@inject(YvesMultiCartPage) private multiCartPage: YvesMultiCartPage) {}

  public execute = (): void => {
    this.multiCartPage.createCart();
  };
}
