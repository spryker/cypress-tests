import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { RefundRepository } from './refund-repository';

@injectable()
@autoWired
export class RefundPage extends BackofficePage {
  @inject(REPOSITORIES.RefundRepository) private repository: RefundRepository;

  protected PAGE_URL = '/refund/table';

  getRefundTable = (): Cypress.Chainable => this.repository.getRefundTable();

  getRefundRows = (): Cypress.Chainable => this.repository.getRefundRows();

  // Sum of every refund recorded against the order currently open on the sales detail page, in the
  // same minor units the order-item totals are published in.
  getTotalRefundedAmount = (): Cypress.Chainable<number> => this.sumRawAmounts(this.repository.getRefundAmountCells());

  // Sum of the order's item totals (`sumPriceToPayAggregation`), the figure a full refund must match.
  getTotalItemAmount = (): Cypress.Chainable<number> => this.sumRawAmounts(this.repository.getItemTotalAmountCells());

  // One item's own total, for comparing a single-item refund against the item it refunded. Read it
  // before triggering the refund: the recalculation that follows writes the item's canceled amount
  // and the row then reports what is left to pay, not what was ordered.
  getItemTotalAmount = (sku: string): Cypress.Chainable<number> =>
    this.sumRawAmounts(this.repository.getItemTotalAmountCellsBySku(sku));

  private sumRawAmounts = (cells: Cypress.Chainable): Cypress.Chainable<number> =>
    cells.then(($cells) => {
      const rawAmountAttribute = this.repository.getRawAmountAttribute();

      return ($cells.toArray() as Array<HTMLElement>).reduce(
        (total: number, cell: HTMLElement) => total + Number(cell.getAttribute(rawAmountAttribute)),
        0
      );
    }) as unknown as Cypress.Chainable<number>;
}
