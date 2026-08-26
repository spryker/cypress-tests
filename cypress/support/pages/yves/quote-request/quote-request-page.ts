import { autoWired } from '@utils';
import { injectable } from 'inversify';

import { YvesPage } from '@pages/yves';

// No per-repository repository: the quote request pages come from the core QuoteRequestPage and
// QuoteRequestAgentPage modules, which the shops do not re-theme, and the feature only exists on
// the company-account storefronts. The markup carries almost no data-qa, so the routes the links
// and forms point at are the handles.
@injectable()
@autoWired
export class QuoteRequestPage extends YvesPage {
  protected PAGE_URL = '/quote-request';

  createFromCart = (): void => {
    cy.visit('/quote-request/create');
    cy.get('form[name="quote_request_form"]').find('button[type="submit"]').click();
  };

  getReference = (): Cypress.Chainable<string> =>
    cy
      .get('a[href*="/quote-request/send-to-user/"]')
      .invoke('attr', 'href')
      .then((href) => (href as string).split('/send-to-user/')[1]);

  sendToAgent = (): void => {
    cy.get('a[href*="/quote-request/send-to-user/"]').click();
  };

  visitDetails = (reference: string): void => {
    cy.visit(`/quote-request/details/${reference}`);
  };

  convertToCart = (reference: string): void => {
    cy.get(`a[href*="/quote-request/convert-to-cart/${reference}"]`).click();
  };

  visitAgentRevise = (reference: string): void => {
    cy.visit(`/agent/quote-request/revise/${reference}`);
  };

  // The price cell is a source-price form: a use_default_price checkbox guards the input, so the
  // custom price is only taken once that box is cleared.
  reviseFirstItemPrice = (price: string): void => {
    cy.get('input[name="use_default_price"]').first().uncheck({ force: true });
    const priceInput = '#quote_request_agent_form_latestVersion_quote_items_0_sourceUnitGrossPrice';

    cy.get(priceInput).clear({ force: true });
    cy.get(priceInput).type(price, { force: true });
  };

  sendToCustomer = (): void => {
    cy.contains('button', 'Send to Customer').click();
  };
}
