import { Page as MultiCartPage } from '../pages/yves/multi-cart/page';

export class CreateCartScenario {
  static execute = (): void => {
    new MultiCartPage().createCart();
  };
}
