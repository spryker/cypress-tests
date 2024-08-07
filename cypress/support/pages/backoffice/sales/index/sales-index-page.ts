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

  getOrderReference = (): Cypress.Chainable => {
    cy.get('dt').contains('Order Reference').next('dd').invoke('text').as('orderReference');

    return cy.get('@orderReference');
  };
}
