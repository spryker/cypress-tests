import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BackofficeSalesIndexRepository } from './backoffice-sales-index-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class BackofficeSalesIndexPage extends AbstractPage {
  public PAGE_URL: string = '/sales';

  constructor(@inject(BackofficeSalesIndexRepository) private repository: BackofficeSalesIndexRepository) {
    super();
  }

  public viewLastPlacedOrder = (): void => {
    cy.visitBackoffice(this.PAGE_URL);
    this.repository.getViewButtons().first().click();
  };
}
