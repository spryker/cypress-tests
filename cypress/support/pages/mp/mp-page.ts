import { injectable } from 'inversify';
import 'reflect-metadata';
import { AbstractPage } from '../abstract-page';
import VisitOptions = Cypress.VisitOptions;

@injectable()
export class MpPage extends AbstractPage {
  visit = (options?: Partial<VisitOptions>): void => {
    cy.visitMerchantPortal(this.PAGE_URL, options);
  };
}
