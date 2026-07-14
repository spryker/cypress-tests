import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AgentQuoteRequestRepository {
  getCartItemSelector = (): string => '.quote-request-cart-item';

  getCostPriceMoleculeSelector = (): string => 'cost-price';

  getCostPriceListSelector = (): string => '.cost-price__list';

  getCostPriceValueSelector = (): string => '.cost-price__value[data-has-cost-price]';

  getGrossMarginSelector = (): string => '.cost-price__gross-margin';

  getGrossMarginUnavailableClass = (): string => 'cost-price__gross-margin--unavailable';

  getGrossMarginUnavailableSelector = (): string => `.${this.getGrossMarginUnavailableClass()}`;

  getCostPriceDataAttribute = (): string => 'data-has-cost-price';

  getUnavailableCostPriceText = (): string => '—';

  getCostPriceWarningIconSelector = (): string => '.font-icon--cost-price-warning';

  getSaveButton = (): Cypress.Chainable => cy.get('button[name="save"], input[name="save"]').first();
}
