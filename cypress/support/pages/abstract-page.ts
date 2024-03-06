import { faker } from '@faker-js/faker';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class AbstractPage {
  protected PAGE_URL = '';
  protected faker = faker;

  public assertPageLocation = (): void => {
    cy.url({ timeout: 4000 }).should('include', this.PAGE_URL);
  };
}
