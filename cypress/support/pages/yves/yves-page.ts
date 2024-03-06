import { injectable } from 'inversify';
import 'reflect-metadata';
import { AbstractPage } from '../abstract-page';
import VisitOptions = Cypress.VisitOptions;

@injectable()
export class YvesPage extends AbstractPage {
  visit = (options?: Partial<VisitOptions>): void => {
    cy.visit(this.PAGE_URL, options);
  };
}
