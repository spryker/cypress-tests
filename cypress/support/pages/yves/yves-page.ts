import 'reflect-metadata';
import { injectable } from 'inversify';
import { AbstractPage } from '../abstract-page';

@injectable()
export class YvesPage extends AbstractPage {
  public visit = (): void => {
    cy.visit(this.PAGE_URL);
  }
}
