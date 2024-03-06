import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BackofficePage } from '../../backoffice-page';
import { SalesIndexRepository } from './sales-index-repository';

@injectable()
@autoWired
export class SalesIndexPage extends BackofficePage {
  @inject(SalesIndexRepository) private repository: SalesIndexRepository;

  protected PAGE_URL: string = '/sales';

  public viewLastPlacedOrder = (): void => {
    cy.visitBackoffice(this.PAGE_URL);
    this.repository.getViewButtons().first().click();
  };
}
