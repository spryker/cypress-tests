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

  /**
   * Opens a named order rather than the newest one. The shards run concurrently against one
   * application, so the first row of the sales table is not reliably this test's order.
   */
  viewByReference = (orderReference: string): void => {
    this.find({ searchQuery: orderReference, interceptTableUrl: '**/sales/index/table**' }).then((getRow) => {
      if (!getRow) {
        return;
      }

      getRow().find(this.repository.getViewButtonSelector()).first().click({ force: true });
    });
  };

  getOrderReference = (): Cypress.Chainable => {
    cy.get('dt').contains('Order Reference').next('dd').invoke('text').as('orderReference');

    return cy.get('@orderReference');
  };
}
