import 'reflect-metadata';
import { injectable } from 'inversify';
import { AbstractPage } from '../abstract-page';
import VisitOptions = Cypress.VisitOptions;

@injectable()
export class YvesPage extends AbstractPage {
  public visit = (options?: Partial<VisitOptions>): void => {
    cy.visit(this.PAGE_URL, options);
  }
}
