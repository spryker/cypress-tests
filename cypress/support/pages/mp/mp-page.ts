import 'reflect-metadata';
import { injectable } from 'inversify';
import { AbstractPage } from '../abstract-page';

@injectable()
export class MpPage extends AbstractPage {
  public visit = (): void => {
    cy.visitMerchantPortal(this.PAGE_URL);
  }
}
