import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '../../backoffice-page';
import { SalesIndexRepository } from './sales-index-repository';

@injectable()
@autoWired
export class SalesIndexPage extends BackofficePage {
  @inject(SalesIndexRepository) private repository: SalesIndexRepository;

  protected PAGE_URL = '/sales';

  viewLastPlacedOrder = (): void => {
    cy.visitBackoffice(this.PAGE_URL);
    this.repository.getViewButtons().first().click();
  };
}
