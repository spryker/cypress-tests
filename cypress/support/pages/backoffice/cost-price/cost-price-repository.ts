export interface CostPriceRepository {
  getPriceTableSelector(): string;
  getPriceTableHeaderSelector(): string;
  getCostAmountInputSelector(): string;
  getCostPriceViewRowSelector(): string;
  getPriceTaxWidgetSelector(): string;
}
