import { injectable } from 'inversify';
import { CostPriceRepository } from '../cost-price-repository';

/**
 * The Demo "Cost Price & Gross Margin" Back Office partials expose no `data-qa` hooks, so these
 * selectors fall back to the stable id / name / text the templates render directly. See:
 *   src/Demo/Zed/ProductManagement/Presentation/_partials/product_price_collection.twig
 *     (edit form — `<table id="price-table-collection">` with the `Cost price` `<th>` and the
 *      `form_widget(moneyValue.cost_amount)` inputs whose `name` contains `cost_amount`)
 *   src/Demo/Zed/ProductManagement/Presentation/View/_partials/info-price-tax.twig
 *     (view page — `<b>Cost price (DEFAULT):</b>` rows inside the "Price & Taxes" widget, a Demo
 *      override; the core vendor template has no cost row)
 *
 * The Cost-price column / row is a Demo-only override (`priceModeCost = 'COST_MODE'`). This is the
 * upmerge regression class these selectors guard: if the Demo override is dropped, the cost inputs
 * and the cost view-row disappear while Gross/Net remain.
 */
@injectable()
export class SuiteCostPriceRepository implements CostPriceRepository {
  // Edit form — the price matrix table that carries the Cost/Gross/Net columns.
  getPriceTableSelector = (): string => '#price-table-collection';

  // Edit form — the column-header cells; the set includes "Cost price", "Gross price", "Net price".
  getPriceTableHeaderSelector = (): string => '#price-table-collection thead th';

  // Edit form — the editable cost-price inputs, e.g.
  // product_form_edit[prices][<store>-<currency>-DEFAULT-BOTH][moneyValue][cost_amount].
  getCostAmountInputSelector = (): string => '#price-table-collection input[name*="cost_amount"]';

  // View page — the bold label of each cost-price row ("Cost price (DEFAULT):"), rendered alongside
  // the Net/Gross rows. Asserted by text via cy.contains() in the page object.
  getCostPriceViewRowSelector = (): string => 'b';

  // View page — the "Price & Taxes" widget heading that wraps the Net/Gross/Cost rows.
  getPriceTaxWidgetSelector = (): string => '.ibox-title h5';
}
