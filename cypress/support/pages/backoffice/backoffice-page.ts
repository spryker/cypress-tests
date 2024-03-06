import { injectable } from 'inversify';
import 'reflect-metadata';
import { AbstractPage } from '../abstract-page';
import VisitOptions = Cypress.VisitOptions;

@injectable()
export class BackofficePage extends AbstractPage {
  visit = (options?: Partial<VisitOptions>): void => {
    cy.visitBackoffice(this.PAGE_URL, options);
  };
}
