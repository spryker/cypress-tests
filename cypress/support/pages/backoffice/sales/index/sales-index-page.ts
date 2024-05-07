import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { SalesIndexRepository } from './sales-index-repository';

@injectable()
@autoWired
export class SalesIndexPage extends BackofficePage {
  @inject(SalesIndexRepository) private repository: SalesIndexRepository;

  protected PAGE_URL = '/sales';

  view = (): void => {
    this.repository.getViewButtons().first().click();
  };

  extractOrderIdFromUrl = (): Cypress.Chainable<string> => {
    return cy.url().then((url) => {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      const idSalesOrder = params.get('id-sales-order');

      if (idSalesOrder === null) {
        throw new Error('id-sales-order not found in URL');
      }

      return idSalesOrder;
    });
  };
}
