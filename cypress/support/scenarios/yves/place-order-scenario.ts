import { CustomerOverviewPage, OrderDetailsPage } from '@pages/yves';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { CheckoutScenario } from './checkout-scenario';

// The storefront order details page is addressed by the order's id, which is also what the back
// office order detail page takes.
const ORDER_ID_QUERY_PARAMETER = 'id';

@injectable()
@autoWired
export class PlaceOrderScenario {
  @inject(CheckoutScenario) private checkoutScenario: CheckoutScenario;
  @inject(CustomerOverviewPage) private customerOverviewPage: CustomerOverviewPage;
  @inject(OrderDetailsPage) private orderDetailsPage: OrderDetailsPage;

  /**
   * Checks the signed-in customer's cart out and yields the id of the order it placed, so the back
   * office can open exactly that order. Searching the sales table instead races the shards that place
   * orders on the same application at the same time.
   */
  execute = (params?: ExecuteParams): Cypress.Chainable<number> => {
    this.checkoutScenario.execute(params);
    this.customerOverviewPage.viewLastPlacedOrder();
    // Reading the url only once the details page has rendered keeps it from yielding the overview's.
    this.orderDetailsPage.getOrderReferenceBlock();

    return cy
      .location('search')
      .then((search: string): number => Number(new URLSearchParams(search).get(ORDER_ID_QUERY_PARAMETER)));
  };
}

type ExecuteParams = Parameters<CheckoutScenario['execute']>[0];
