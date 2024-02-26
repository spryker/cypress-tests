import 'reflect-metadata';
import { injectable } from 'inversify';
import { AbstractPage } from '../abstract-page';

@injectable()
export class BackofficePage extends AbstractPage {
  public visit = (): void => {
    cy.visitBackoffice(this.PAGE_URL);
  }
}
