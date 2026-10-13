import { CustomerOverviewPage, OrderDetailsPage } from '@pages/yves';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { CheckoutScenario } from './checkout-scenario';

@injectable()
@autoWired
export class PlaceOrderScenario {
  @inject(CheckoutScenario) private checkoutScenario: CheckoutScenario;
  @inject(CustomerOverviewPage) private customerOverviewPage: CustomerOverviewPage;
  @inject(OrderDetailsPage) private orderDetailsPage: OrderDetailsPage;

  /**
   * Checks the signed-in customer's cart out and yields the reference of the order it placed — the
   * handle the back office looks an order up by, since the newest row of its sales table belongs to
   * whichever shard ordered last.
   */
  execute = (params?: ExecuteParams): Cypress.Chainable<string> => {
    this.checkoutScenario.execute(params);
    this.customerOverviewPage.viewLastPlacedOrder();

    return this.orderDetailsPage
      .getOrderReferenceBlock()
      .then((orderReference: string): string => orderReference.trim());
  };
}

type ExecuteParams = Parameters<CheckoutScenario['execute']>[0];
