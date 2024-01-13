import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import { BackofficeSalesDetailRepository } from './backoffice-sales-detail-repository';

@injectable()
@autoProvide
export class BackofficeSalesDetailPage extends AbstractPage {
  public PAGE_URL: string = '/sales/detail';

  constructor(@inject(BackofficeSalesDetailRepository) private repository: BackofficeSalesDetailRepository) {
    super();
  }

  public triggerOms = (state: string): void => {
    cy.url().then((url) => {
      cy.reloadUntilFound(
        url,
        this.repository.getOmsButtonSelector(state),
        this.repository.getTriggerOmsDivSelector(),
        30,
        2000
      );

      cy.get(this.repository.getTriggerOmsDivSelector()).find(this.repository.getOmsButtonSelector(state)).click();
    });
  };

  public createReturn = (): void => {
    this.repository.getReturnButton().click();
  };
}
