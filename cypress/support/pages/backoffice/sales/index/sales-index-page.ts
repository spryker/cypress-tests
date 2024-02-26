import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { SalesIndexRepository } from './sales-index-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';
import { BackofficePage } from '../../backoffice-page';

@injectable()
@autoWired
export class SalesIndexPage extends BackofficePage {
  protected PAGE_URL: string = '/sales';

  constructor(@inject(SalesIndexRepository) private repository: SalesIndexRepository) {
    super();
  }

  public viewLastPlacedOrder = (): void => {
    cy.visitBackoffice(this.PAGE_URL);
    this.repository.getViewButtons().first().click();
  };
}
