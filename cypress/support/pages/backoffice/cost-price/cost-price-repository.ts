import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CostPriceRepository {
  getPriceTableSelector = (): string => '#price-table-collection';

  getPriceTableHeaderSelector = (): string => '#price-table-collection thead th';

  getCostAmountInputSelector = (): string => '#price-table-collection input[name*="cost_amount"]';

  getCostPriceViewRowSelector = (): string => 'b';

  getPriceTaxWidgetSelector = (): string => '.ibox-title h5';

  getPriceTaxTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-price_and_tax"]');

  getFirstVisibleCostAmountInput = (): Cypress.Chainable =>
    cy.get('#price-table-collection input.js-formatted-money-input[data-target*="cost_amount"]').first();

  getFirstCostAmountHiddenInput = (): Cypress.Chainable =>
    cy.get(`#price-table-collection input[type="hidden"][name*="cost_amount"]`).first();

  getSaveButton = (): Cypress.Chainable => cy.get('[name="product_form_edit"] [value="Save"]');

  getSaveSuccessMessage = (sku: string): Cypress.Chainable =>
    cy.contains(`The product [${sku}] was saved successfully`, { timeout: 20000 });

  getCostPriceViewValueCells = (): Cypress.Chainable =>
    cy.get('.row').filter(':contains("Cost price")').find('.col-xs-8');
}
