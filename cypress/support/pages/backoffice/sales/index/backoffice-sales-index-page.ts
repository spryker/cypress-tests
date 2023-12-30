import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import { BackofficeSalesIndexRepository } from './backoffice-sales-index-repository';

@injectable()
@autoProvide
export class BackofficeSalesIndexPage extends AbstractPage {
  public PAGE_URL: string = '/sales';

  constructor(
    @inject(BackofficeSalesIndexRepository)
    private repository: BackofficeSalesIndexRepository
  ) {
    super();
  }

  viewLastPlacedOrder = (): void => {
    cy.visitBackoffice(this.PAGE_URL);
    this.repository.getViewButtons().first().click();
  };
}
