import 'reflect-metadata';
import { injectable } from 'inversify';
import { AbstractPage } from '../abstract-page';
import VisitOptions = Cypress.VisitOptions;

@injectable()
export class MpPage extends AbstractPage {
  public visit = (options?: Partial<VisitOptions>): void => {
    cy.visitMerchantPortal(this.PAGE_URL, options);
  };
}
